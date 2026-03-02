import React from 'react'
import type { Property } from '@/payload-types'
import { PropertyCard } from './components/PropertyCard'
import { Hero } from './components/Hero'
import { SectionTitle } from './components/Text/Text'

async function getProperties() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/properties?sort=-createdAt&depth=1`,
    {
      next: {
        tags: ['properties'],
      },
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch properties')
  }

  const data = await response.json()
  return data.docs
}

export default async function HomePage() {
  const properties: Property[] = await getProperties()

  return (
    <div className="home">
      <Hero />
      <div className="wrapper">
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
