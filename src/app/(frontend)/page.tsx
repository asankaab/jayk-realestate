import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import type { Media, Property } from '@/payload-types'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: properties }: { docs: Property[] } = await payload.find({
    collection: 'properties',
    sort: '-createdAt',
    depth: 1, // Add depth to populate relationships
  })

  return (
    <div className="home">
      <div className="content">
        <h1>Properties For Sale</h1>
        <div className="properties-grid">
          {properties.map((property) => {
            const firstImage = property.images?.[0] as Media | undefined

            return (
              <div key={property.id} className="property-card">
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
              </div>
            )
          })}
          {properties.length === 0 && <p>No properties found.</p>}
        </div>
      </div>
    </div>
  )
}
