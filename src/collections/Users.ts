import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'author', 'user'],
      defaultValue: ['user'],
      required: true,
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) => {
          if (!user) return false
          const roles = Array.isArray(user.roles) ? user.roles : [user.roles]
          return roles.includes('admin')
        },
      },
    },
  ],
}
