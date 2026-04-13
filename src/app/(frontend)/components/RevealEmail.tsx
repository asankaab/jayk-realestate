'use client'
import React, { useState } from 'react'

export const RevealEmail = ({ email }: { email: string }) => {
  const [isRevealed, setIsRevealed] = useState(false)

  const maskEmail = (em: string) => {
    const [localPart, domainPart] = em.split('@')
    if (!domainPart) return em

    const maskedLocal =
      localPart.length > 2
        ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1]
        : localPart + '**'

    const domainSplit = domainPart.split('.')
    const domainName = domainSplit[0]
    const maskedDomain =
      domainName.length > 2
        ? domainName[0] + '*'.repeat(domainName.length - 2) + domainName[domainName.length - 1]
        : domainName + '**'

    return `${maskedLocal}@${maskedDomain}.${domainSplit.slice(1).join('.')}`
  }

  return (
    <span
      onClick={() => setIsRevealed(true)}
      style={{
        fontSize: '0.875rem',
        color: '#666',
        cursor: isRevealed ? 'text' : 'pointer',
        display: 'inline-block',
        paddingBlock: '0.5rem',
      }}
      title={isRevealed ? '' : 'Click to reveal email'}
    >
      {isRevealed ? email : maskEmail(email)}
    </span>
  )
}
