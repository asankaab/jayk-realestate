'use client'

import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'

export const ClerkPayloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ClerkProvider
      appearance={{
        options: {
          logoImageUrl: '/jayk-logo.svg',
        },
        variables: {
          fontSize: '1rem',
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
