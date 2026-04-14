'use client'
import React, { useRef, useState, useEffect } from 'react'
import type { Property } from '@/payload-types'
import { PropertyCard } from './PropertyCard'
import styles from './PropertyListings.module.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PropertyListingsProps {
  properties: Property[]
}

export const PropertyListings: React.FC<PropertyListingsProps> = ({ properties }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollability = () => {
    const container = scrollContainerRef.current
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (container) {
      const propertyCard = container.querySelector(`.${styles.propertyCardWrapper}`)
      const scrollAmount = propertyCard ? propertyCard.clientWidth : container.clientWidth * 0.8
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    checkScrollability()
    window.addEventListener('resize', checkScrollability)
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollability)
    }
    return () => {
      window.removeEventListener('resize', checkScrollability)
      if (container) {
        container.removeEventListener('scroll', checkScrollability)
      }
    }
  }, [properties])

  return (
    <div className={styles.PropertyListingsContainer}>
      <div className={styles.propertiesGrid} ref={scrollContainerRef}>
        {properties.map((property) => (
          <div key={property.id} className={styles.propertyCardWrapper}>
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
      {canScrollLeft && (
        <button className={`${styles.scrollButton} ${styles.left}`} onClick={() => scroll('left')}>
          <ChevronLeft />
        </button>
      )}
      {canScrollRight && (
        <button
          className={`${styles.scrollButton} ${styles.right}`}
          onClick={() => scroll('right')}
        >
          <ChevronRight />
        </button>
      )}
    </div>
  )
}
