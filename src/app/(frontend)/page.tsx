import React from 'react'
import type { Property } from '@/payload-types'
import { payloadClient } from '../lib/payloadClient'
import { Hero } from './components/Hero'
import { SectionTitle } from './components/Text/Text'
import { FeaturedProperties } from './components/FeaturedProperties'
import { ExploreNeighborhoods } from './components/ExploreNeighborhoods'
import { Blog } from './components/Blog'

export default async function HomePage() {
  const { docs: properties }: { docs: Property[] } = await payloadClient.find({
    collection: 'properties',
    sort: '-createdAt',
    depth: 1, // Add depth to populate relationships
    limit: 10,
  })

  return (
    <div className="home">
      <Hero />
      <div className="wrapper">
        <SectionTitle>Featured Properties</SectionTitle>
        <FeaturedProperties properties={properties} />
        {properties.length === 0 && <p>No properties found.</p>}
      </div>
      <ExploreNeighborhoods />
      <Blog />
    </div>
  )
}
