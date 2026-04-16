import type { Property } from '@/payload-types'
import { payloadClient } from '@/app/lib/payloadClient'
import { unstable_cache } from 'next/cache'
import { SectionTitle, Body } from './Text/Text'
import { PropertyListings } from './PropertyListings'

const getProperties = unstable_cache(
  async () => {
    const data = await payloadClient.find({
      collection: 'properties',
      sort: '-createdAt',
      depth: 1, // Add depth to populate relationships
      limit: 10,
    })

    return data
  },
  ['home-properties-list'],
  { tags: ['properties'] },
)

export async function RecentListings() {
  const { docs: properties }: { docs: Property[] } = await getProperties()

  return (
    <section>
      <div className="wrapper">
        <SectionTitle>Recent Listings</SectionTitle>
        <PropertyListings properties={properties} />
        {properties.length === 0 && <Body>No properties found.</Body>}
      </div>
    </section>
  )
}
