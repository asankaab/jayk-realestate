'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, House } from 'lucide-react'
import styles from './DashboardShell.module.css'

const links = [
  { href: '/dashboard', label: 'My Properties', icon: House },
  { href: '/watchlist', label: 'Watchlist', icon: Heart },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <p className={styles.title}>My Account</p>
      <nav aria-label="Dashboard" className={styles.navigation}>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={styles.link}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={20} aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
