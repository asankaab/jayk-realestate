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
    hidden: ({ user }) => user?.role !== 'admin',
  },
  auth: {
    disableLocalStrategy: true,
    strategies: [
      {
        name: 'clerk',
        authenticate: async ({ headers, payload }) => {
          const { auth } = await import('@clerk/nextjs/server')
          const { userId } = await auth()
          console.log(userId)

          if (!userId) return { user: null }

          const userQuery = await payload.find({
            collection: 'users',
            where: { clerkId: { equals: userId } },
          })

          if (userQuery.docs.length > 0) {
            return {
              user: userQuery.docs[0],
              collection: 'users',
            }
          }

          return { user: null }
        },
      },
    ],
  },
  fields: [
    {
      type: 'group',
      label: '*',
      hidden: true,
      fields: [
        {
          name: 'clerkId',
          type: 'text',
          unique: true,
          index: true,
          admin: { readOnly: true },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          unique: true,
          admin: {
            readOnly: true,
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'firstName',
              type: 'text',
              required: true,
              admin: {
                readOnly: true,
              },
              hooks: {
                beforeChange: [capitalizeFirstLetter],
              },
            },
            {
              name: 'lastName',
              type: 'text',
              required: false,
              admin: {
                readOnly: true,
              },
              hooks: {
                beforeChange: [capitalizeFirstLetter],
              },
            },
          ],
        },
      ],
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
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
