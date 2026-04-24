'use client'

import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'

export const ClerkPayloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const disableDevelopmentMode = process.env.NEXT_PUBLIC_DISABLE_DEVELOPMENT_MODE

  return (
    <ClerkProvider
      appearance={{
        theme: 'simple',
        variables: {
          fontSize: '1rem',
          spacing: '1.2rem',
        },
        options: {
          unsafe_disableDevelopmentModeWarnings: disableDevelopmentMode,
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
