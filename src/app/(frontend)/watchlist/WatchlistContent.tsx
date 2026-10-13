'use client'

import { SignInButton, useUser } from '@clerk/nextjs'
import { useWatchlist } from '../components/WatchlistProvider'
import { PropertyCard } from '../components/PropertyCard'
import Button from '../components/Button'
import styles from './Watchlist.module.css'

export function WatchlistContent() {
  const { isSignedIn, isLoaded } = useUser()
  const { properties, loading, error, reload } = useWatchlist()
  return (
    <div>
      <div className={styles.header}>
        <h1>My Watchlist</h1>
        <Button href="/properties">Browse Properties</Button>
      </div>
      {!isLoaded ? (
        <p role="status">Loading your watchlist…</p>
      ) : !isSignedIn ? (
        <div className={styles.empty}>
          <h2>Keep your favorite properties together</h2>
          <p>Sign in to save properties to your account.</p>
          <SignInButton mode="modal">
            <Button>Sign in</Button>
          </SignInButton>
        </div>
      ) : loading ? (
        <p role="status">Loading your watchlist…</p>
      ) : error ? (
        <div role="alert">
          <p>{error}</p>
          <Button onClick={reload}>Try again</Button>
        </div>
      ) : properties.length ? (
        <div className={styles.grid}>
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <h2>No saved properties yet</h2>
          <p>Select the heart on any property to add it to your watchlist.</p>
        </div>
      )}
    </div>
  )
}
