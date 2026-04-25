'use client'

import React from 'react'
import { UserButton } from '@clerk/nextjs'
import { PanelsTopBottom } from 'lucide-react'

export const ClerkAvatar: React.FC = () => {
  return (
    <div
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Link
            label="Settings"
            labelIcon={<PanelsTopBottom size={12} />}
            href="/admin/account"
          />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  )
}
