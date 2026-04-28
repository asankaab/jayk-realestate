'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'
import MiniFooter from './MiniFooter'

const DASHBOARD_PATH = '/dashboard'

const RouteFooter = () => {
  const pathname = usePathname()
  const isDashboardRoute =
    pathname === DASHBOARD_PATH || pathname.startsWith(`${DASHBOARD_PATH}/`)

  return isDashboardRoute ? <MiniFooter /> : <Footer />
}

export default RouteFooter
