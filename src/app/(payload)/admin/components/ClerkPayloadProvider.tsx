'use client'

import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'

export const ClerkPayloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ClerkProvider
      appearance={{
        theme: 'simple',
        variables: {
          fontSize: '1rem',
          spacing: '1.2rem',
        },
      }}
      localization={{
        signIn: {
          start: {
            title: 'Sign in to admin panel',
          },
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
