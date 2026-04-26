'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { payloadClient } from '@/app/lib/payloadClient'
import { auth } from '@clerk/nextjs/server'

async function getPayloadUser(clerkId: string) {
  const userQuery = await payloadClient.find({
    collection: 'users',
    where: { clerkId: { equals: clerkId } },
  })
  return userQuery.docs[0]
}

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
      },
    })
  } catch (error) {
    console.error('Error creating property:', error)
    throw new Error('Failed to create property')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

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
      },
    })
  } catch (error) {
    console.error('Error updating property:', error)
    throw new Error('Failed to update property')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

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
