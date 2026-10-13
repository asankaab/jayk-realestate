import * as watchlist from './20260928_000000_watchlist'

export const migrations = [
  { up: watchlist.up, down: watchlist.down, name: '20260928_000000_watchlist' },
]
