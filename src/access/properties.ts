import type { Access } from 'payload'

export const canReadProperties: Access = ({ req: { user } }) => {
  if (!user) {
    return true
  }

  if (user.role === 'admin') {
    return true
  }

  return {
    addedBy: {
      equals: user.id,
    },
  }
}

export const canUpdateDeleteProperties: Access = ({ req: { user } }) => {
  if (!user) {
    return false
  }

  if (user.role === 'admin') {
    return true
  }

  return {
    addedBy: {
      equals: user.id,
    },
  }
}
