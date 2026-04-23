'use client'

import React from 'react'
import { SignIn } from '@clerk/nextjs'

export const ClerkLogin: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <SignIn routing="hash" fallbackRedirectUrl="/admin" />
      <div style={{ marginTop: '2rem' }}>
        <img 
          src="/PayloadLogoBlack.svg" 
          alt="Payload CMS" 
          style={{ height: '30px', opacity: 0.5 }} 
        />
      </div>
    </div>
  )
}
