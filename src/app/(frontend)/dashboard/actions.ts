'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { payloadClient } from '@/app/lib/payloadClient'
import { auth } from '@clerk/nextjs/server'
import sharp from 'sharp'

async function getPayloadUser(clerkId: string) {
  const userQuery = await payloadClient.find({
    collection: 'users',
    where: { clerkId: { equals: clerkId } },
  })
  return userQuery.docs[0]
}

const WATERMARK_IMAGE = 'https://jayk-realestate.vercel.app/watermark.png'
const OPTIMIZED_IMAGE_WIDTH = 1600
const OPTIMIZED_IMAGE_HEIGHT = 1200
const WATERMARK_WIDTH_RATIO = 0.35

// Upload image to temp file service and return the URL
async function uploadToTempService(file: Blob, filename = 'img.webp'): Promise<string> {
  const formData = new FormData()
  formData.append('file', file, filename)

  const response = await fetch('https://tmpfiles.org/api/v1/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Failed to upload to temp service: ${response.status} ${errorBody}`)
  }

  const { data } = (await response.json()) as { data: { url: string } }

  // Convert upload URL to download URL: https://tmpfiles.org/dl/...

  const url = new URL(data.url)
  const path = url.pathname.startsWith('/dl/') ? url.pathname : `/dl${url.pathname}`
  const urlString = `https://${url.host}${path}`

  return urlString
}

async function createWatermarkedImage(
  file: File,
): Promise<{ buffer: Buffer; contentType: string }> {
  const imageBuffer = Buffer.from(await file.arrayBuffer())
  const optimizedImageBuffer = await sharp(imageBuffer)
    .rotate()
    .resize({
      width: OPTIMIZED_IMAGE_WIDTH,
      height: OPTIMIZED_IMAGE_HEIGHT,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toBuffer()

  const metadata = await sharp(optimizedImageBuffer).metadata()

  if (!metadata.width) {
    throw new Error('Failed to read image dimensions')
  }

  const watermarkResponse = await fetch(WATERMARK_IMAGE)
  if (!watermarkResponse.ok) {
    throw new Error('Failed to fetch watermark image')
  }

  const watermarkBuffer = Buffer.from(await watermarkResponse.arrayBuffer())
  const resizedWatermark = await sharp(watermarkBuffer)
    .resize({
      width: Math.round(metadata.width * WATERMARK_WIDTH_RATIO),
      withoutEnlargement: true,
    })
    .png()
    .toBuffer()

  const buffer = await sharp(optimizedImageBuffer)
    .composite([
      {
        input: resizedWatermark,
        gravity: 'center',
      },
    ])
    .webp({ quality: 82 })
    .toBuffer()

  return {
    buffer,
    contentType: 'image/webp',
  }
}

function getImageExtension(contentType: string) {
  if (contentType.includes('webp')) return '.webp'
  if (contentType.includes('png')) return '.png'

  return '.jpg'
}

function isAllowedTempImageUrl(value: string) {
  try {
    const url = new URL(value.trim())
    return (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      (url.hostname === 'tmpfiles.org' || url.hostname.endsWith('.tmpfiles.org')) &&
      url.pathname.startsWith('/dl/')
    )
  } catch {
    return false
  }
}

async function uploadNewImageValue(img: FormDataEntryValue, title: string, userId: number) {
  if (typeof img !== 'string') {
    throw new Error('Unexpected image upload value')
  }

  const imageValue = img.trim()

  if (isAllowedTempImageUrl(imageValue)) {
    return uploadWatermarkedImageToPayload(imageValue, title, userId)
  }

  const parsedId = Number(imageValue)
  if (!isNaN(parsedId)) {
    return parsedId
  }

  throw new Error(`Invalid processed image URL: ${imageValue}`)
}

// Process a single image: add watermark first, then upload the result to temp service
export async function processImage(
  file: File,
): Promise<{ tempUrl: string; watermarkedUrl: string }> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files can be processed')
  }

  const watermarkedImage = await createWatermarkedImage(file)

  const watermarkedFile = new File([new Uint8Array(watermarkedImage.buffer)], 'img.webp', {
    type: watermarkedImage.contentType,
  })
  const watermarkedUrl = await uploadToTempService(watermarkedFile)

  return {
    tempUrl: watermarkedUrl,
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

  const contentType = 'image/webp'
  const extension = getImageExtension(contentType)
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
    const imageId = await uploadNewImageValue(img, title, user.id as number)
    imageIds.push(imageId)
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
    const imageId = await uploadNewImageValue(img, title, user.id as number)
    uploadedImageIds.push(imageId)
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
