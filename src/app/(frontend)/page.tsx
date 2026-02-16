import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import type { Property } from '@/payload-types'
import { PropertyCard } from './components/PropertyCard'
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
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
          {properties.length === 0 && <p>No properties found.</p>}
        </div>
      </div>
    </div>
  )
}
