import type { Access } from 'payload'

export const canReadMedia: Access = ({ req: { user } }) => {
  if (!user) {
    return true
  }

  if (user.role === 'admin') {
    return true
  }

  return {
    user: {
      equals: user.id,
    },
  }
}

export const canUpdateDeleteMedia: Access = ({ req: { user } }) => {
  if (!user) {
    return false
  }

  if (user.role === 'admin') {
    return true
  }

  return {
    user: {
      equals: user.id,
    },
  }
}
