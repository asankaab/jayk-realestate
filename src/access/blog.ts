import type { Access } from 'payload'

/**
 * Only admins and authors can create blog posts
 */
export const canCreateBlog: Access = ({ req: { user } }) => {
  if (!user) return false

  const roles = Array.isArray(user.roles) ? user.roles : [user.roles]
  return roles.includes('admin') || roles.includes('author')
}

/**
 * Admins can read all blog posts
 * Authors can read their own blog posts and published posts
 */
export const canReadBlog: Access = ({ req: { user } }) => {
  if (!user) {
    // Unauthenticated users see only published posts
    return {
      status: { equals: 'published' },
    } as any
  }

  const roles = Array.isArray(user.roles) ? user.roles : [user.roles]

  if (roles.includes('admin')) {
    // Admins see all posts
    return true
  }

  if (roles.includes('author')) {
    // Authors see their own posts and all published posts
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

  const roles = Array.isArray(user.roles) ? user.roles : [user.roles]

  if (roles.includes('admin')) {
    return true
  }

  if (roles.includes('author') && id) {
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

  const roles = Array.isArray(user.roles) ? user.roles : [user.roles]
  return roles.includes('admin')
}
