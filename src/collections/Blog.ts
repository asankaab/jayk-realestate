import type { CollectionConfig, CollectionBeforeValidateHook } from 'payload'
import { revalidate } from '../lib/revalidate'
import { canCreateBlog, canReadBlog, canUpdateBlog, canDeleteBlog } from '../access/blog'

// Generate slug from title and auto-set author from current user
const beforeValidateHook: CollectionBeforeValidateHook = ({ data, req }) => {
  if (!data) return data

  // Generate slug from title
  if (data.title && !data.slug) {
    data.slug = data.title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
  }

  // Auto-set author to current user
  if (req.user && !data.author) {
    data.author = req.user.id
  }

  return data
}

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'createdAt'],
  },
  access: {
    create: canCreateBlog,
    read: canReadBlog,
    update: canUpdateBlog,
    delete: canDeleteBlog,
  },
  hooks: {
    beforeValidate: [beforeValidateHook],
    afterChange: [revalidate('blog')],
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
      options: ['draft', 'published'],
      defaultValue: 'draft',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        condition: (data) => data.featured,
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'category',
      type: 'select',
      options: ['Real Estate Tips', 'Market Insights', 'Property Guides', 'Investment', 'News'],
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief summary of the blog post',
      },
    },
  ],
  timestamps: true,
}
