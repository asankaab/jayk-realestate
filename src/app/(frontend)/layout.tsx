import React from 'react'
import Navbar from './components/Navbar'
import './styles/main.css'
import { Albert_Sans } from 'next/font/google'
import Footer from './components/Footer'
import { ClerkProvider } from '@clerk/nextjs'

const albertSans = Albert_Sans({ subsets: ['latin'], weight: '400' })

export const metadata = {
  description: 'Buy, sell, rent properties',
  title: 'Jayk Real Estate',
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const disableDevelopmentMode = process.env.NEXT_PUBLIC_DISABLE_DEVELOPMENT_MODE

  return (
    <ClerkProvider
      appearance={{
        options: {
          unsafe_disableDevelopmentModeWarnings: disableDevelopmentMode,
        },
        variables: {
          colorRing: '#DEDEDE',
        },
      }}
    >
      <html lang="en">
        <body className={albertSans.className}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
