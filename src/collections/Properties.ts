import type { CollectionConfig, CollectionBeforeValidateHook } from 'payload'
import { revalidate } from '@/lib/revalidate'

// All validation hooks run before any other hooks.
// This is where we can generate the slug and auto-set the user.
const beforeValidateHook: CollectionBeforeValidateHook = ({ data, req }) => {
  if (!data) return data

  if (data.title && !data.slug) {
    data.slug = data.title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
  }

  // Auto-set the user who added the property
  if (req.user && !data.addedBy) {
    data.addedBy = req.user.id
  }

  return data
}

export const Properties: CollectionConfig = {
  slug: 'properties',
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    beforeValidate: [beforeValidateHook],
    afterChange: [revalidate('properties')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'addedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: ['For Sale', 'For Rent', 'Sold', 'Leased'],
      defaultValue: 'For Sale',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'bedrooms',
      type: 'number',
      required: false,
    },
    {
      name: 'bathrooms',
      type: 'number',
      required: false,
    },
    {
      name: 'area',
      type: 'number',
      label: 'Area (sq. ft.)',
    },
    {
      name: 'location',
      type: 'text',
      required: true,
    },
    {
      name: 'images',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
  ],
}
