import type { CollectionConfig } from 'payload'

export const Watchlist: CollectionConfig = {
  slug: 'watchlist',
  admin: { useAsTitle: 'property', defaultColumns: ['property', 'owner', 'createdAt'] },
  lockDocuments: false,
  access: {
    read: ({ req: { user } }) => (user ? { owner: { equals: user.id } } : false),
    // Mutations go through authenticated server actions, which derive the owner.
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'owner', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'property', type: 'relationship', relationTo: 'properties', required: true },
    // Database uniqueness also protects against simultaneous saves from multiple tabs.
    { name: 'saveKey', type: 'text', required: true, unique: true },
  ],
}
