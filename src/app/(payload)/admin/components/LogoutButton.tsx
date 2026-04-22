'use client'

import React from 'react'
import { useClerk } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'

export const LogoutButton: React.FC = () => {
  const { signOut } = useClerk()

  const handleLogout = async () => {
    await signOut({ redirectUrl: '/admin' })
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: 'transparent',
        border: 'none',
        color: 'currentColor',
        cursor: 'pointer',
        padding: '10px 20px',
        font: 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        width: '100%',
        textAlign: 'left',
      }}
      title="Log out"
      aria-label="Log out"
    >
      <LogOut size={18} />
      Log out
    </button>
  )
}
