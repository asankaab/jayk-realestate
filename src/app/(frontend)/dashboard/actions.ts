'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { payloadClient } from '@/app/lib/payloadClient'
import { auth } from '@clerk/nextjs/server'

const JAYK_LOGO_URL = 'https://jayk-realestate.vercel.app/watermark.png'

// Upload image to temp file service and return the URL
async function uploadToTempService(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('https://tmpfiles.org/api/v1/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload to temp service')
  }

  const { data } = (await response.json()) as { data: { url: string } }

  // Convert upload URL to download URL: https://tmpfiles.org/dl/...

  const url = await new URL(data.url)
  const imgPath = await url.pathname
  const urlString = `https://tmpfiles.org/dl${await imgPath}`

  return urlString
}

async function getPayloadUser(clerkId: string) {
  const userQuery = await payloadClient.find({
    collection: 'users',
    where: { clerkId: { equals: clerkId } },
  })
  return userQuery.docs[0]
}

// Helper function to add watermark to an image
async function addWatermarkToImage(imageUrl: string): Promise<Buffer> {
  const watermarkUrl = new URL('https://quickchart.io/watermark')
  watermarkUrl.searchParams.set('mainImageUrl', imageUrl)
  watermarkUrl.searchParams.set('markImageUrl', JAYK_LOGO_URL)
  watermarkUrl.searchParams.set('markRatio', '0.25')
  watermarkUrl.searchParams.set('position', 'center')

  const response = await fetch(watermarkUrl.toString())

  if (response.status !== 200) {
    throw new Error('Failed to create watermark')
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

// Upload image with watermark
async function uploadImageWithWatermark(
  file: File,
  userId: number,
  title?: string,
): Promise<number> {
  // First upload the image to temp service to get a URL
  const tempUrl = await uploadToTempService(file)

  // Apply watermark using QuickChart API
  const watermarkedBuffer = await addWatermarkToImage(tempUrl)

  // Upload the watermarked image directly to Payload
  const watermarkedMedia = await payloadClient.create({
    collection: 'media',
    data: {
      alt: title || file.name,
      user: userId,
    },
    file: {
      data: watermarkedBuffer,
      mimetype: file.type,
      name: title || file.name,
      size: watermarkedBuffer.length,
    },
  } as any)

  return watermarkedMedia.id as number
}

// Process a single image: upload to temp service and generate watermarked URL
export async function processImage(
  file: File,
): Promise<{ tempUrl: string; watermarkedUrl: string }> {
  // Upload to temp service
  const tempUrl = await uploadToTempService(file)

  // Generate watermarked URL using QuickChart API
  const watermarkedUrl = `https://quickchart.io/watermark?mainImageUrl=${encodeURIComponent(tempUrl)}&markImageUrl=${encodeURIComponent(JAYK_LOGO_URL)}&markRatio=0.2&position=center`

  return {
    tempUrl,
    watermarkedUrl,
  }
}

// Upload watermarked image to Payload
async function uploadWatermarkedImageToPayload(
  watermarkedUrl: string,
  alt: string,
  userId: number,
): Promise<number> {
  // Fetch the watermarked image
  const response = await fetch(watermarkedUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch watermarked image')
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Determine mime type from URL or default to jpeg
  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const extension = contentType.includes('png') ? '.png' : '.jpg'
  const fileName = `${alt.replace(/[^a-zA-Z0-9]/g, '_')}${extension}`

  // Upload to Payload
  const media = await payloadClient.create({
    collection: 'media',
    data: {
      alt,
      user: userId,
    },
    file: {
      data: buffer,
      mimetype: contentType,
      name: fileName,
      size: buffer.length,
    },
  } as any)

  return media.id as number
}

// create property

export async function createProperty(formData: FormData) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const user = await getPayloadUser(userId)
  if (!user) {
    throw new Error('User not found in CMS')
  }

  const title = formData.get('title') as string
  const status = formData.get('status') as 'For Sale' | 'For Rent' | 'Sold' | 'Leased'
  const price = Number(formData.get('price'))
  const location = formData.get('location') as string
  const bedrooms = formData.get('bedrooms') ? Number(formData.get('bedrooms')) : undefined
  const bathrooms = formData.get('bathrooms') ? Number(formData.get('bathrooms')) : undefined
  const area = formData.get('area') ? Number(formData.get('area')) : undefined

  const newImages = formData.getAll('newImages')
  const imageIds: number[] = []

  for (const img of newImages) {
    if (typeof img === 'string') {
      // Check if it's a watermarked URL (starts with quickchart)
      if (img.includes('quickchart.io/watermark')) {
        const imageId = await uploadWatermarkedImageToPayload(img, title, user.id as number)
        imageIds.push(imageId)
      } else {
        // It's a processed image ID
        const parsedId = Number(img)
        if (!isNaN(parsedId)) {
          imageIds.push(parsedId)
        }
      }
    } else if (img instanceof File && img.size > 0 && img.name) {
      // Fallback: process File objects (shouldn't happen with new flow)
      const imageId = await uploadImageWithWatermark(img, user.id as number, title)
      imageIds.push(imageId)
    }
  }

  try {
    await payloadClient.create({
      collection: 'properties',
      data: {
        title,
        status,
        price,
        location,
        bedrooms,
        bathrooms,
        area,
        addedBy: user.id,
        images: imageIds.length > 0 ? imageIds : undefined,
      },
    })
  } catch (error) {
    console.error('Error creating property:', error)
    throw new Error('Failed to create property')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

// update property

export async function updateProperty(id: string, formData: FormData) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const user = await getPayloadUser(userId)
  if (!user) {
    throw new Error('User not found')
  }

  const property = await payloadClient.findByID({ collection: 'properties', id })
  const addedById = typeof property.addedBy === 'object' ? property.addedBy.id : property.addedBy
  if (addedById !== user.id) {
    throw new Error('Unauthorized: You do not own this property')
  }

  const title = formData.get('title') as string
  const status = formData.get('status') as 'For Sale' | 'For Rent' | 'Sold' | 'Leased'
  const price = Number(formData.get('price'))
  const location = formData.get('location') as string
  const bedrooms = formData.get('bedrooms') ? Number(formData.get('bedrooms')) : undefined
  const bathrooms = formData.get('bathrooms') ? Number(formData.get('bathrooms')) : undefined
  const area = formData.get('area') ? Number(formData.get('area')) : undefined

  const existingImageIds = formData.getAll('existingImages').map((id) => Number(id))
  const newImages = formData.getAll('newImages')
  const uploadedImageIds: number[] = []

  for (const img of newImages) {
    if (typeof img === 'string') {
      if (img.includes('quickchart.io/watermark')) {
        const imageId = await uploadWatermarkedImageToPayload(img, title, user.id as number)
        uploadedImageIds.push(imageId)
      } else {
        const parsedId = Number(img)
        if (!isNaN(parsedId)) {
          uploadedImageIds.push(parsedId)
        }
      }
    } else if (img instanceof File && img.size > 0 && img.name) {
      const imageId = await uploadImageWithWatermark(img, user.id as number, title)
      uploadedImageIds.push(imageId)
    }
  }

  const finalImages = [...existingImageIds, ...uploadedImageIds]

  try {
    await payloadClient.update({
      collection: 'properties',
      id,
      data: {
        title,
        status,
        price,
        location,
        bedrooms,
        bathrooms,
        area,
        images: finalImages.length > 0 ? finalImages : null,
      },
    })
  } catch (error) {
    console.error('Error updating property:', error)
    throw new Error('Failed to update property')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

// delete property

export async function deleteProperty(id: string) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const user = await getPayloadUser(userId)
  if (!user) {
    throw new Error('User not found')
  }

  const property = await payloadClient.findByID({ collection: 'properties', id })
  const addedById = typeof property.addedBy === 'object' ? property.addedBy.id : property.addedBy
  if (addedById !== user.id) {
    throw new Error('Unauthorized: You do not own this property')
  }

  // Delete associated images
  if (property.images && Array.isArray(property.images)) {
    for (const image of property.images) {
      const imageId = typeof image === 'object' ? image.id : image
      try {
        await payloadClient.delete({
          collection: 'media',
          id: imageId,
        })
      } catch (err) {
        console.error('Error deleting image:', err)
      }
    }
  }

  try {
    await payloadClient.delete({
      collection: 'properties',
      id,
    })
  } catch (error) {
    console.error('Error deleting property:', error)
    throw new Error('Failed to delete property')
  }

  revalidatePath('/dashboard')
}
