import React from 'react'
import Link from 'next/link'
import type { Media, Property } from '@/payload-types'

interface PropertyCardProps {
  property: Property
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const firstImage = property.images?.[0] as Media | undefined

  return (
    <div className="property-card">
      <Link href={`/properties/${property.slug}`} key={property.id} >
        <div className="property-image-container">
          {firstImage && firstImage.url ? (
            <img src={firstImage.url} alt={property.title} className="property-image" />
          ) : (
            <div className="no-image-placeholder">No Image</div>
          )}
          <div className="property-status-badge">{property.status}</div>
        </div>
      </Link>
      <div className="property-details">
        <div className="property-price-and-title">
          <p className="property-price">${property.price.toLocaleString()}</p>
          <h2>{property.title}</h2>
        </div>
        <p className="property-location">{property.location}</p>
        <div className="property-specs">
          <span>
            Beds: <strong>{property.bedrooms}</strong>
          </span>
          <span>
            Baths: <strong>{property.bathrooms}</strong>
          </span>
          <span>
            Sq.Ft: <strong>{property.area}</strong>
          </span>
        </div>
        <Link href={`/properties/${property.slug}`} className="view-details-button">
          View Details
        </Link>
      </div>
    </div>
  )
}
