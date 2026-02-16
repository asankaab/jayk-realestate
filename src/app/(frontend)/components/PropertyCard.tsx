import React from 'react'
import Link from 'next/link'
import type { Media, Property } from '@/payload-types'

interface PropertyCardProps {
  property: Property
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const firstImage = property.images?.[0] as Media | undefined

  return (
    <Link href={`/properties/${property.id}`} key={property.id} className="property-card">
      <div className="property-image-container">
        {firstImage && firstImage.url ? (
          <img src={firstImage.url} alt={property.title} className="property-image" />
        ) : (
          <div className="no-image-placeholder">No Image</div>
        )}
        <div className="property-status-badge">{property.status}</div>
      </div>
      <div className="property-details">
        <h2>{property.title}</h2>
        <p className="property-location">{property.location}</p>
        <p className="property-price">${property.price.toLocaleString()}</p>
        <div className="property-specs">
          <span>
            <strong>{property.bedrooms}</strong> bed
          </span>
          <span>
            <strong>{property.bathrooms}</strong> bath
          </span>
          <span>
            <strong>{property.area}</strong> sq. ft.
          </span>
        </div>
      </div>
    </Link>
  )
}
