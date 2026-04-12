import type { Access } from 'payload'

/**
 * Only admins and authors can create blog posts
 */
export const canCreateBlog: Access = ({ req: { user } }) => {
  if (!user) return false

  return user.roles === 'admin' || user.roles === 'author'
}

/**
 * Admins can read all blog posts
 * Authors can read their own blog posts and published posts
 */
export const canReadBlog: Access = ({ req: { user } }) => {
  if (!user) {
    // Unauthenticated users see only published posts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {
      status: { equals: 'published' },
    } as any
  }

  if (user.roles === 'admin') {
    // Admins see all posts
    return true
  }

  if (user.roles === 'author') {
    // Authors see their own posts and all published posts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {
      or: [{ author: { equals: user.id } }, { status: { equals: 'published' } }],
    } as any
  }

  return false
}

/**
 * Admins can update any blog post
 * Authors can only update their own blog posts
 */
export const canUpdateBlog: Access = async ({ req: { user, payload }, id }) => {
  if (!user) return false

  if (user.roles === 'admin') {
    return true
  }

  if (user.roles === 'author' && id) {
    // Authors can only update their own posts
    const post = await payload.findByID({
      collection: 'blog',
      id: String(id),
      depth: 0,
    })
    return post?.author === user.id
  }

  return false
}

/**
 * Only admins can delete blog posts
 */
export const canDeleteBlog: Access = ({ req: { user } }) => {
  if (!user) return false

  return user.roles === 'admin'
}
