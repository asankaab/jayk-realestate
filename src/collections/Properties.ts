import type { CollectionConfig } from 'payload'
import type { BeforeValidateHook } from 'payload/types'

// All validation hooks run before any other hooks.
// This is where we can generate the slug from the title.
const generateSlug: BeforeValidateHook = ({ data }) => {
  if (data.title && !data.slug) {
    data.slug = data.title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
  }

  return data
}

export const Properties: CollectionConfig = {
  slug: 'properties',
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    beforeValidate: [generateSlug],
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
      required: true,
    },
    {
      name: 'bathrooms',
      type: 'number',
      required: true,
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
