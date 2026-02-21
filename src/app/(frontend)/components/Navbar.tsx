'use client'

import Link from 'next/link'
import { useState } from 'react'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className={styles.navbar}>
      <div className="wrapper">
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <Link href="/">
              <img src="jayk-logo.svg" alt="jayk logo" />
            </Link>
          </div>
          <div className={styles.navLinks}>
            <Link href="/">Home</Link>
            <Link href="/properties">Properties</Link>
            <Link href="/our-agents">Our Agents</Link>
            <Link href="/about-us">About Us</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className={styles.login}>
            <Link href="/login" className={styles.loginButton}>
              Login
            </Link>
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
        <div className={styles.mobileNav}>
          <div className="wrapper">
            <Link href="/" onClick={toggleMenu}>
              Home
            </Link>
            <Link href="/properties" onClick={toggleMenu}>
              Properties
            </Link>
            <Link href="/our-agents" onClick={toggleMenu}>
              Our Agents
            </Link>
            <Link href="/about-us" onClick={toggleMenu}>
              About Us
            </Link>
            <Link href="/contact" onClick={toggleMenu}>
              Contact
            </Link>
            <Link href="/login" onClick={toggleMenu} className={styles.loginButton}>
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
