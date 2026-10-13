import type { ReactNode } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import styles from './DashboardShell.module.css'

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className={`wrapper ${styles.shell}`}>
      <DashboardSidebar />
      <div className={styles.content}>{children}</div>
    </div>
  )
}
