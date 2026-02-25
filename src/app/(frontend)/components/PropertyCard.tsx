import React from 'react'
import Link from 'next/link'
import type { Media, Property } from '@/payload-types'
import styles from './PropertyCard.module.css'
import Button from './Button'
import { Heart, Share2 } from 'lucide-react'
import { Body, Heading3, Small } from './Text/Text'
import Image from 'next/image'

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
            <Image
              src={firstImage.url}
              alt={property.title}
              className={styles.propertyImage}
              fill
            />
          ) : (
            <div className={styles.noImagePlaceholder}>No Image</div>
          )}
          <div className={styles.propertyStatusBadge}>{property.status}</div>
        </div>
      </Link>
      <div className={styles.propertyDetails}>
        <div>
          <Heading3 color="primary">${property.price.toLocaleString()}</Heading3>
          <Body>{property.title}</Body>
        </div>
        <Small color="primary">{property.location}</Small>
        <div>
          <div className={styles.propertySpecs}>
            <div className={styles.propertyFeatures}>
              <Small>
                Beds: <strong>{property.bedrooms}</strong>
              </Small>
              <Small>
                Baths: <strong>{property.bathrooms}</strong>
              </Small>
            </div>
            <Small>
              Sq.Ft: <strong>{property.area}</strong>
            </Small>
          </div>
          <div className={styles.buttonContainer}>
            <Button color="primary" fill="outlined" href={`/properties/${property.slug}`}>
              View Details
            </Button>
            <div className={styles.actionContainer}>
              <button className={styles.actionButton}>
                <Heart /> 21
              </button>
              <button className={styles.actionButton}>
                <Share2 />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
