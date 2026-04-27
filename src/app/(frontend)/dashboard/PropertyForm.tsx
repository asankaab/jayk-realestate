'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Heading3 } from '@/app/(frontend)/components/Text/Text'
import styles from './PropertyForm.module.css'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import Button from '@/app/(frontend)/components/Button'
import { processImage } from './actions'

type ProcessedImage = {
  id: number
  url: string
}

type NewImagePreview = {
  file: File
  preview: string
  processing?: boolean
}

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
    images?: { id: number; url: string }[]
  }
  onSubmit: (formData: FormData) => Promise<void>
  title: string
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSubmit, title }) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingImages, setExistingImages] = useState<{ id: number; url: string }[]>(
    initialData?.images || [],
  )
  const [newImagePreviews, setNewImagePreviews] = useState<
    {
      file: File
      preview: string
      processing?: boolean
    }[]
  >([])
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([])

  // Check if any images are still being processed
  const isProcessing = newImagePreviews.some((img) => img.processing)

  const handleRemoveImage = (id: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleNewImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB in bytes
    const newPreviews: { file: File; preview: string; processing: boolean }[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" exceeds the 1MB size limit!`)
        continue
      }
      const preview = URL.createObjectURL(file)
      newPreviews.push({ file, preview, processing: true })
    }

    setNewImagePreviews((prev) => [...prev, ...newPreviews])

    // Process each image after selection
    for (let i = 0; i < newPreviews.length; i++) {
      const index = newImagePreviews.length + i
      const { file, preview } = newPreviews[i]

      try {
        const titleInput = document.getElementById('title') as HTMLInputElement | null;
        const currentTitle = titleInput?.value;
        const processed = await processImage(file, currentTitle)
        setProcessedImages((prev) => [...prev, processed])
        setNewImagePreviews((prev) =>
          prev.map((p, idx) => (idx === index ? { ...p, processing: false } : p)),
        )
      } catch (err) {
        console.error('Failed to process image:', err)
        setError(`Failed to process "${file.name}". Please try again.`)
        setNewImagePreviews((prev) => prev.filter((_, idx) => idx !== index))
      }
    }
  }

  const handleRemoveNewImage = (index: number) => {
    setNewImagePreviews((prev) => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
    setProcessedImages((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Create formData from the form
    const formData = new FormData(e.currentTarget)

    // Remove the automatically appended file objects
    formData.delete('newImages')

    // Append processed image IDs instead of files
    processedImages.forEach((img) => {
      formData.append('newImages', img.id.toString())
    })

    try {
      await onSubmit(formData)
    } catch (err: any) {
      if (isRedirectError(err)) {
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

        {initialData?.images && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Existing Images</label>
            {existingImages.length > 0 ? (
              <div className={styles.imageGrid}>
                {existingImages.map((img) => (
                  <div key={img.id} className={styles.imageWrapper}>
                    <Image
                      src={img.url}
                      alt="Property Image"
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="100px"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                    <input type="hidden" name="existingImages" value={img.id} />
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noImagesText}>No existing images.</p>
            )}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="newImages" className={styles.label}>
            {initialData ? 'Upload Additional Images' : 'Upload Images'}
          </label>
          <input
            type="file"
            id="newImages"
            name="newImages"
            multiple
            accept="image/*"
            className={styles.input}
            onChange={handleNewImageChange}
            disabled={isSubmitting || isProcessing}
          />
          {newImagePreviews.length > 0 && (
            <div className={styles.imageGrid}>
              {newImagePreviews.map((img, index) => (
                <div key={index} className={styles.imageWrapper}>
                  {img.processing ? (
                    <div className={styles.processingOverlay}>
                      <span className={styles.spinner}></span>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <Image
                      src={img.preview}
                      alt={`New Image ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="100px"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className={styles.removeButton}
                    disabled={isSubmitting || isProcessing}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.buttonWrapper}>
          <Button href="/dashboard" fill="outlined" disabled={isSubmitting || isProcessing}>
            Cancel
          </Button>
          <Button color="accent" type="submit" disabled={isSubmitting || isProcessing}>
            {isSubmitting || isProcessing ? 'Processing...' : 'Save Property'}
          </Button>
        </div>

        {error && <small className={styles.errorMessage}>{error}</small>}
      </form>
    </div>
  )
}
