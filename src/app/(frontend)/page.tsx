import React from 'react'
import type { Property } from '@/payload-types'
import { PropertyCard } from './components/PropertyCard'
import { payloadClient } from '../lib/payloadClient'
import { Hero } from './components/Hero'
import { SectionTitle } from './components/Text/Text'

export default async function HomePage() {
  const { docs: properties }: { docs: Property[] } = await payloadClient.find({
    collection: 'properties',
    sort: '-createdAt',
    depth: 1, // Add depth to populate relationships
  })

  return (
    <div className="home">
      <Hero />
      <div className="wrapper" style={{ paddingBlock: '2rem' }}>
        <SectionTitle>Featured Properties</SectionTitle>
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
