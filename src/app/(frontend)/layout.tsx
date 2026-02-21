import React from 'react'
import Navbar from './components/Navbar'
import './styles/main.css'
import { Albert_Sans } from 'next/font/google'

const albertSans = Albert_Sans({ subsets: ['latin'], weight: '400' })

export const metadata = {
  description: 'Buy, sell, rent properties',
  title: 'Jayk Real Estate',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={albertSans.className}>
        <Navbar />
        <main>
          <div className="wrapper">{children}</div>
        </main>
      </body>
    </html>
  )
}
