'use client'

import { useEffect, useState } from 'react'
import { useClerk, useUser } from '@clerk/nextjs'
import { Heart } from 'lucide-react'
import { useWatchlist } from './WatchlistProvider'
import { getPropertySaveCount } from '../watchlist/actions'
import styles from './WatchlistButton.module.css'

export function WatchlistButton({ propertyId }: { propertyId: number }) {
  const { isSignedIn, isLoaded } = useUser()
  const clerk = useClerk()
  const { properties, loading, pending, error: loadError, reload, toggle } = useWatchlist()
  const [error, setError] = useState('')
  const [saveCount, setSaveCount] = useState<number | null>(null)
  const saved = properties.some((property) => property.id === propertyId)
  const label = saved ? 'Remove from watchlist' : 'Save to watchlist'

  useEffect(() => {
    let active = true
    getPropertySaveCount(propertyId)
      .then((count) => {
        if (active) setSaveCount(count)
      })
      .catch(() => {
        if (active) setSaveCount(null)
      })
    return () => {
      active = false
    }
  }, [propertyId])

  return (
    <span className={styles.container}>
      <button
        type="button"
        className={styles.button}
        aria-label={label}
        title={label}
        aria-pressed={saved}
        disabled={!isLoaded || (isSignedIn && loading) || pending.has(propertyId)}
        onClick={async () => {
          setError('')
          if (!isSignedIn) {
            clerk.openSignIn()
            return
          }
          if (loadError) {
            reload()
            return
          }
          try {
            await toggle(propertyId)
          } catch {
            setError('Unable to update your watchlist. Please try again.')
            return
          }
          getPropertySaveCount(propertyId).then(setSaveCount).catch(() => setSaveCount(null))
        }}
      >
        <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
      </button>
      <span className={styles.count} aria-label={`${saveCount ?? 0} saves`}>
        {saveCount ?? '–'}
      </span>
      {(error || loadError) && (
        <span role="alert" className={styles.error}>
          {error || loadError}
        </span>
      )}
    </span>
  )
}
