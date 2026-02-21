import React from 'react'
import type { Property } from '@/payload-types'
import { PropertyCard } from './components/PropertyCard'
import { payloadClient } from '../lib/payloadClient'

export default async function HomePage() {
  const { docs: properties }: { docs: Property[] } = await payloadClient.find({
    collection: 'properties',
    sort: '-createdAt',
    depth: 1, // Add depth to populate relationships
  })

  return (
    <div className="home">
      <div className="content">
        <h1>Properties For Sale</h1>
        <div className="properties-grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
          {properties.length === 0 && <p>No properties found.</p>}
        </div>
      </div>
    </div>
  )
}
