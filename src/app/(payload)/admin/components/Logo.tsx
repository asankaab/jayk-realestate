'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export const Logo: React.FC = () => {
  const pathname = usePathname()

  // Hide the logo on the login page to avoid duplicating the logo
  // since Clerk's SignIn component already displays it.
  if (pathname === '/admin/login' || pathname.endsWith('/login')) {
    return null
  }

  return (
    <img
      src="/jayk-logo.svg"
      alt="Jayk Real Estate"
      style={{ maxHeight: '45px', maxWidth: '100%' }}
    />
  )
}
