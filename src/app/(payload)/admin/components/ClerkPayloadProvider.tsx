'use client'

import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'

export const ClerkPayloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ClerkProvider>{children}</ClerkProvider>
}
