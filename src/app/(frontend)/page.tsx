import type { Property } from '@/payload-types'
import { payloadClient } from '@/app/lib/payloadClient'
import { Hero } from './components/Hero'
import { SectionTitle, Body } from './components/Text/Text'
import { ExploreNeighborhoods } from './components/ExploreNeighborhoods'
import { Blog } from './components/Blog'
import { PropertyListings } from './components/PropertyListings'

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
      <section className="RecentListingsSection">
        <div className="wrapper">
          <SectionTitle>Recent Listings</SectionTitle>
          <PropertyListings properties={properties} />
          {properties.length === 0 && <Body>No properties found.</Body>}
        </div>
      </section>
      <ExploreNeighborhoods />
      <Blog />
    </div>
  )
}
