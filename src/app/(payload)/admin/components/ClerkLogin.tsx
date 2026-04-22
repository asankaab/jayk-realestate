'use client'

import React from 'react'
import { SignIn } from '@clerk/nextjs'

export const ClerkLogin: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <SignIn routing="hash" fallbackRedirectUrl="/admin" />
    </div>
  )
}
