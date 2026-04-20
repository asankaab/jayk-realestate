import type { CollectionConfig, CollectionBeforeValidateHook } from 'payload'
import { canReadMedia, canUpdateDeleteMedia } from '../access/media'

const beforeValidateHook: CollectionBeforeValidateHook = ({ data, req }) => {
  if (!data) return data

  if (req.user && !data.user) {
    data.user = req.user.id
  }

  return data
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: canReadMedia,
    update: canUpdateDeleteMedia,
    delete: canUpdateDeleteMedia,
  },
  hooks: {
    beforeValidate: [beforeValidateHook],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  upload: true,
}
