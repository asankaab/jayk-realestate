'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import styles from './AuthModal.module.css'
import Button from './Button'
import Image from 'next/image'

const AuthModalContent: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const authParam = searchParams.get('auth')
  const isOpen = authParam === 'login' || authParam === 'signup'
  const view = authParam === 'signup' ? 'signup' : 'login'

  if (!isOpen) return null

  const onClose = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('auth')
    const queryString = newParams.toString()
    router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }

  const toggleView = () => {
    const newView = view === 'login' ? 'signup' : 'login'
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('auth', newView)
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false })
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        <div className={styles.header}>
          <Image
            src="/jayk-logo.svg"
            alt="Jayk Logo"
            width={60}
            height={30}
            className={styles.logo}
          />
          <h2 className={styles.title}>
            {view === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className={styles.subtitle}>
            {view === 'login'
              ? 'Enter your details to access your account.'
              : 'Join us to find your dream property.'}
          </p>
        </div>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          {view === 'signup' && (
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className={styles.input}
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className={styles.submitButton}>
            {view === 'login' ? 'Log In' : 'Sign Up'}
          </Button>
        </form>

        <div className={styles.footer}>
          <p className={styles.toggleText}>
            {view === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" className={styles.toggleButton} onClick={toggleView}>
              {view === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

const AuthModal: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <AuthModalContent />
    </Suspense>
  )
}

export default AuthModal
