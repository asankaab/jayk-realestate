'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from './Navbar.module.css'
import Button from './Button'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'

const navLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/blog', label: 'Blog' },
  { href: '/about-us', label: 'Company' },
  { href: '/contact', label: 'Contact' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className="wrapper">
          <div className={styles.navContent}>
            <div className={styles.leftSide}>
              <Link href="/" className={styles.logo}>
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
                {!user ? (
                  <>
                    <SignInButton mode="modal">
                      <button className={styles.loginBtn}>Login</button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className={styles.signupBtn}>Sign up</button>
                    </SignUpButton>
                  </>
                ) : (
                  <UserButton />
                )}
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
              {!user ? (
                <>
                  <SignInButton mode="modal">
                    <button className={styles.loginBtn} onClick={toggleMenu}>
                      Login
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className={styles.signupBtn} onClick={toggleMenu}>
                      Sign up
                    </button>
                  </SignUpButton>
                </>
              ) : (
                <div style={{ padding: '0.5rem 0' }}>
                  <UserButton />
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
