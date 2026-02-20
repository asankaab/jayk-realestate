import React from 'react'
import Link from 'next/link'
import type { Media, Property } from '@/payload-types'
import styles from './PropertyCard.module.css'
import { Heart, Share2 } from 'lucide-react'

interface PropertyCardProps {
  property: Property
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const firstImage = property.images?.[0] as Media | undefined

  return (
    <div className={styles.propertyCard}>
      <Link href={`/properties/${property.slug}`} key={property.id}>
        <div className={styles.propertyImageContainer}>
          {firstImage && firstImage.url ? (
            <img src={firstImage.url} alt={property.title} className={styles.propertyImage} />
          ) : (
            <div className={styles.noImagePlaceholder}>No Image</div>
          )}
          <div className={styles.propertyStatusBadge}>{property.status}</div>
        </div>
      </Link>
      <div className={styles.propertyDetails}>
        <div className={styles.propertyPriceAndTitle}>
          <h2 className={styles.propertyPrice}>${property.price.toLocaleString()}</h2>
          <p>{property.title}</p>
        </div>
        <div>
          <p className={styles.propertyLocation}>{property.location}</p>
          <div className={styles.propertySpecs}>
            <div className={styles.propertyFeatures}>
              <span>
                Beds: <strong>{property.bedrooms}</strong>
              </span>
              <span>
                Baths: <strong>{property.bathrooms}</strong>
              </span>
            </div>
            <span>
              Sq.Ft: <strong>{property.area}</strong>
            </span>
          </div>
          <div className={styles.buttonContainer}>
            <Link href={`/properties/${property.slug}`} className={styles.button}>
              View Details
            </Link>
            <div>
              <button className={styles.miniButton}>
                <Heart />
              </button>
              <button className={styles.miniButton}>
                <Share2 />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
