'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from './Navbar.module.css'
import Button from './Button'

const navLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/our-agents', label: 'Our Agents' },
  { href: '/about-us', label: 'Company' },
  { href: '/contact', label: 'Contact' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
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
              <Button size="small" color="accent" href="/signup" onClick={toggleMenu}>
                Sign up
              </Button>
              <Button
                size="small"
                fill="outlined"
                color="primary"
                href="/login"
                onClick={toggleMenu}
              >
                Login
              </Button>
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
            <Button color="accent" href="/signup" onClick={toggleMenu}>
              Sign up
            </Button>
            <Button fill="outlined" color="primary" href="/login" onClick={toggleMenu}>
              Login
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
