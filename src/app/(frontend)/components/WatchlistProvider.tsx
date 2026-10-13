'use client'

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'
import type { Property } from '@/payload-types'
import { getWatchlist, setPropertySaved } from '../watchlist/actions'

type WatchlistState = {
  properties: Property[]
  loading: boolean
  error: string
  pending: Set<number>
  reload: () => void
  toggle: (id: number) => Promise<void>
}
const Context = createContext<WatchlistState | null>(null)

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser()
  const accountId = user?.id
  const currentAccount = useRef(accountId)
  currentAccount.current = accountId
  const [state, setState] = useState<{ accountId?: string; properties: Property[] }>({
    properties: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(new Set<number>())
  const busy = useRef(new Set<number>())
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    let active = true
    setError('')
    setLoading(true)
    if (!isLoaded) return
    if (!accountId) {
      setState({ properties: [] })
      setLoading(false)
      return
    }
    getWatchlist()
      .then((properties) => {
        if (active) setState({ accountId, properties })
      })
      .catch(() => {
        if (active) setError('Unable to load your watchlist. Please try again.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [accountId, isLoaded, revision])

  const properties = state.accountId === accountId ? state.properties : []
  async function toggle(id: number) {
    if (!accountId || busy.current.has(id)) return
    busy.current.add(id)
    setPending(new Set(busy.current))
    try {
      await setPropertySaved(id, !properties.some((property) => property.id === id))
      const updated = await getWatchlist()
      if (currentAccount.current === accountId) setState({ accountId, properties: updated })
    } finally {
      busy.current.delete(id)
      setPending(new Set(busy.current))
    }
  }

  return (
    <Context.Provider
      value={{
        properties,
        loading: !isLoaded || loading,
        error,
        pending,
        reload: () => setRevision((value) => value + 1),
        toggle,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useWatchlist() {
  const context = useContext(Context)
  if (!context) throw new Error('WatchlistProvider is required')
  return context
}
