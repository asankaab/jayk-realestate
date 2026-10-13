'use server'

import { auth } from '@clerk/nextjs/server'
import { payloadClient } from '@/app/lib/payloadClient'

async function getWatchlistUser() {
  const { userId } = await auth()
  if (!userId) throw new Error('Please sign in to use your watchlist.')
  // Trusted identity lookup: the Clerk ID comes only from the verified session.
  const { docs } = await payloadClient.find({
    collection: 'users',
    where: { clerkId: { equals: userId } },
    depth: 0,
    limit: 1,
  })
  if (!docs[0]) throw new Error('Your account is still syncing. Please try again shortly.')
  return docs[0]
}

export async function getWatchlist() {
  const user = await getWatchlistUser()
  const { docs } = await payloadClient.find({
    collection: 'watchlist',
    user,
    overrideAccess: false,
    depth: 0,
    pagination: false,
    sort: '-createdAt',
  })
  const ids = docs
    .map(({ property }) => (typeof property === 'object' ? property?.id : property))
    .filter((id): id is number => typeof id === 'number')
  if (!ids.length) return []
  // Use public property access; signed-in CMS access is restricted to owned listings.
  const properties = await payloadClient.find({
    collection: 'properties',
    overrideAccess: false,
    user: null,
    where: { id: { in: ids } },
    pagination: false,
    depth: 1,
  })
  return properties.docs.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
}

export async function setPropertySaved(propertyId: number, saved: boolean) {
  if (!Number.isSafeInteger(propertyId) || propertyId <= 0 || typeof saved !== 'boolean') {
    throw new Error('Invalid watchlist request.')
  }
  const user = await getWatchlistUser()
  const saveKey = `${user.id}:${propertyId}`
  // Intentional privileged writes: owner and unique key are derived server-side.
  if (!saved) {
    await payloadClient.delete({ collection: 'watchlist', where: { saveKey: { equals: saveKey } } })
    return
  }
  await payloadClient.findByID({
    collection: 'properties',
    id: propertyId,
    overrideAccess: false,
    user: null,
    depth: 0,
  })
  const existing = await payloadClient.find({
    collection: 'watchlist',
    user,
    overrideAccess: false,
    where: { saveKey: { equals: saveKey } },
    depth: 0,
    limit: 1,
  })
  if (existing.docs.length) return
  try {
    await payloadClient.create({
      collection: 'watchlist',
      data: { owner: user.id, property: propertyId, saveKey },
    })
  } catch (error) {
    // Treat a concurrent save as success, but preserve genuine database failures.
    const concurrent = await payloadClient.find({
      collection: 'watchlist',
      user,
      overrideAccess: false,
      where: { saveKey: { equals: saveKey } },
      depth: 0,
      limit: 1,
    })
    if (!concurrent.docs.length) throw error
  }
}
