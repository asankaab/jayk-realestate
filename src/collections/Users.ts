import type { CollectionConfig, FieldHook } from 'payload'

const capitalizeFirstLetter: FieldHook = ({ value }) => {
  if (typeof value === 'string' && value.length > 0) {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
  return value
}

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
      hooks: {
        beforeChange: [capitalizeFirstLetter],
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: false,
      hooks: {
        beforeChange: [capitalizeFirstLetter],
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      maxLength: 250,
      required: false,
    },
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'author', 'user'],
      defaultValue: 'user',
      required: true,
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) => {
          if (!user) return false
          return user.role === 'admin'
        },
      },
    },
  ],
}
