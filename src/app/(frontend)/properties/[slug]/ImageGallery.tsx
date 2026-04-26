'use client'
import React, { useState, useRef, TouchEvent } from 'react'
import type { Media } from '@/payload-types'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import styles from './ImageGallery.module.css'

interface ImageGalleryProps {
  images: Media[]
  title: string
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  if (!images || images.length === 0) {
    return (
      <div className={styles.noImagePlaceholder}>
        <div>No images available</div>
      </div>
    )
  }

  const selectedImage = images[selectedImageIndex]
  const imageUrl = selectedImage?.url || '/placeholder.jpg'

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.changedTouches[0].clientX
  }

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].clientX
    handleSwipe()
  }

  const handleSwipe = () => {
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
      setIsLoading(true)
    }

    if (isRightSwipe && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
      setIsLoading(true)
    }
  }

  const handlePrevious = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
      setIsLoading(true)
    }
  }

  const handleNext = () => {
    if (selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
      setIsLoading(true)
    }
  }

  return (
    <div className={styles.gallery}>
      <div
        className={styles.imageContainer}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading && (
          <div className={`${styles.skeleton} ${styles.skeletonPulse}`}>
            <ImageIcon size={80} />
          </div>
        )}
        <Image
          src={imageUrl}
          alt={title}
          className={`${styles.mainImage} ${isLoading ? styles.mainImageLoading : ''}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          onLoad={() => setIsLoading(false)}
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              disabled={selectedImageIndex === 0}
              className={`${styles.navigationButton} ${styles.navigationButtonPrev}`}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              disabled={selectedImageIndex === images.length - 1}
              className={`${styles.navigationButton} ${styles.navigationButtonNext}`}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className={styles.imageCounter}>
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={styles.thumbnailsContainer}>
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => {
                if (selectedImageIndex !== index) {
                  setSelectedImageIndex(index)
                  setIsLoading(true)
                }
              }}
              className={`${styles.thumbnail} ${
                selectedImageIndex === index ? styles.thumbnailActive : styles.thumbnailInactive
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url || '/placeholder.jpg'}
                alt={image.alt || `${title} thumbnail ${index + 1}`}
                className={styles.thumbnailImage}
                fill
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
