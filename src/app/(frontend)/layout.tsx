import React from 'react'
import Navbar from './components/Navbar'
import './styles.css'
import { Albert_Sans } from 'next/font/google'

const albertSans = Albert_Sans({ subsets: ['latin'], weight: '400' })

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={albertSans.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
