import { DashboardShell } from '../dashboard/DashboardShell'
import { WatchlistContent } from './WatchlistContent'

export const metadata = { title: 'My Watchlist | Jayk Real Estate' }

export default function WatchlistPage() {
  return (
    <DashboardShell>
      <WatchlistContent />
    </DashboardShell>
  )
}
