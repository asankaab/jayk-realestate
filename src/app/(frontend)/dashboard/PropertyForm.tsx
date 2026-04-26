'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heading3 } from '@/app/(frontend)/components/Text/Text'
import styles from './PropertyForm.module.css'

type PropertyFormProps = {
  initialData?: {
    id: string
    title: string
    status: 'For Sale' | 'For Rent' | 'Sold' | 'Leased'
    price: number
    location: string
    bedrooms?: number | null
    bathrooms?: number | null
    area?: number | null
  }
  onSubmit: (formData: FormData) => Promise<void>
  title: string
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSubmit, title }) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      await onSubmit(formData)
    } catch (err: any) {
      if (err?.message === 'NEXT_REDIRECT' || err?.digest?.startsWith('NEXT_REDIRECT')) {
        throw err
      }
      console.error(err)
      setError('An error occurred while saving the property. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.formWrapper}>
      <Heading3 className={styles.formTitle}>{title}</Heading3>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Property Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={initialData?.title}
            required
            className={styles.input}
            placeholder="e.g., Beautiful Modern Home"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.label}>
              Status *
            </label>
            <select
              id="status"
              name="status"
              defaultValue={initialData?.status || 'For Sale'}
              required
              className={styles.select}
            >
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
              <option value="Sold">Sold</option>
              <option value="Leased">Leased</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>
              Price *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              defaultValue={initialData?.price}
              required
              min="0"
              className={styles.input}
              placeholder="e.g., 500000"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location" className={styles.label}>
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            defaultValue={initialData?.location}
            required
            className={styles.input}
            placeholder="e.g., 123 Main St, Anytown"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="bedrooms" className={styles.label}>
              Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              defaultValue={initialData?.bedrooms || ''}
              min="0"
              className={styles.input}
              placeholder="e.g., 3"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bathrooms" className={styles.label}>
              Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              defaultValue={initialData?.bathrooms || ''}
              min="0"
              step="0.5"
              className={styles.input}
              placeholder="e.g., 2"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="area" className={styles.label}>
              Area (sq. ft.)
            </label>
            <input
              type="number"
              id="area"
              name="area"
              defaultValue={initialData?.area || ''}
              min="0"
              className={styles.input}
              placeholder="e.g., 2000"
            />
          </div>
        </div>

        <div className={styles.buttonWrapper}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => router.push('/dashboard')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
            {isSubmitting ? 'Saving...' : 'Save Property'}
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
      </form>
    </div>
  )
}
