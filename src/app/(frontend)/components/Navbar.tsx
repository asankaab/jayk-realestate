'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import styles from './Navbar.module.css'
import Button from './Button'
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
  useClerk,
  ClerkLoading,
  ClerkLoaded,
  UserAvatar,
} from '@clerk/nextjs'

const navLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/blog', label: 'Blog' },
  { href: '/about-us', label: 'Company' },
  { href: '/contact', label: 'Contact' },
]

function ClerkModalManager() {
  const searchParams = useSearchParams()
  const clerk = useClerk()
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded || user) return

    if (searchParams.has('sign-in')) {
      clerk.openSignIn()
    } else if (searchParams.has('sign-up')) {
      clerk.openSignUp()
    }
  }, [searchParams, clerk, user, isLoaded])

  return null
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()
  const clerk = useClerk()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <header className={styles.header}>
      <Suspense fallback={null}>
        <ClerkModalManager />
      </Suspense>
      <nav className={styles.navbar}>
        <div className="wrapper">
          <div className={styles.navContent}>
            <div className={styles.leftSide}>
              <Link href="/" className={styles.logo} onClick={() => setIsOpen(false)}>
                <Image src="/jayk-logo.svg" alt="jayk logo" width={80} height={40} />
              </Link>
              <div className={styles.navLinks}>
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className={styles.rightSide}>
              <div className={styles.buttonContainer}>
                <ClerkLoading>
                  <div className={styles.skeleton}></div>
                </ClerkLoading>
                <ClerkLoaded>
                  {!user ? (
                    <>
                      <SignInButton mode="modal">
                        <Button size="small">Login</Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button size="small" color="accent">
                          Sign up
                        </Button>
                      </SignUpButton>
                    </>
                  ) : (
                    <UserButton>
                      <UserButton.MenuItems>
                        <UserButton.Link
                          label="Dashboard"
                          href="/dashboard"
                          labelIcon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              width="16"
                              height="16"
                            >
                              <rect x="3" y="3" width="7" height="7"></rect>
                              <rect x="14" y="3" width="7" height="7"></rect>
                              <rect x="14" y="14" width="7" height="7"></rect>
                              <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                          }
                        />
                        <UserButton.Action label="manageAccount" />
                        <UserButton.Action label="signOut" />
                      </UserButton.MenuItems>
                    </UserButton>
                  )}
                </ClerkLoaded>
              </div>
            </div>
            <div className={styles.hamburger} onClick={toggleMenu}>
              {/* Hamburger Icon */}
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className={styles.mobileNav + ' wrapper'}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={toggleMenu}>
                {link.label}
              </Link>
            ))}
            <div className={styles.buttonContainer}>
              <ClerkLoading>
                <div className={styles.skeleton}></div>
              </ClerkLoading>
              <ClerkLoaded>
                {!user ? (
                  <div style={{ display: 'flex', gap: '.5rem', width: '100%', height: '2.5rem' }}>
                    <SignInButton mode="modal">
                      <Button style={{ width: '100%' }} size="small" onClick={toggleMenu}>
                        Login
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button
                        style={{ width: '100%' }}
                        size="small"
                        color="accent"
                        onClick={toggleMenu}
                      >
                        Sign up
                      </Button>
                    </SignUpButton>
                  </div>
                ) : (
                  <div className={styles.userProfileContainer}>
                    <Button
                      style={{ width: '100%', marginBottom: '0.5rem' }}
                      size="small"
                      color="primary"
                      href="/dashboard"
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Button>
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        width: '100%',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ flexShrink: 0, display: 'flex' }}>
                        <UserAvatar />
                      </div>
                      <Button
                        style={{ width: '100%' }}
                        size="small"
                        fill="outlined"
                        onClick={() => {
                          clerk.openUserProfile()
                        }}
                      >
                        Manage Account
                      </Button>
                      <Button
                        style={{ width: '100%' }}
                        size="small"
                        color="accent"
                        onClick={() => {
                          clerk.signOut()
                          toggleMenu()
                        }}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                )}
              </ClerkLoaded>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
