import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { payloadClient } from '@/app/lib/payloadClient'
import { Heading2, Heading3, Body } from '@/app/(frontend)/components/Text/Text'
import Button from '@/app/(frontend)/components/Button'
import styles from './Dashboard.module.css'
import { DashboardPropertyCard } from './DashboardPropertyCard'
import { headers } from 'next/headers'

export const metadata = {
  title: 'Dashboard | Jayk Real Estate',
}

export default async function DashboardPage() {
  const { userId } = await auth()

  const header = await headers()

  const { user } = await payloadClient.auth({ headers: header })

  if (!userId) {
    redirect('/')
  }

  let properties: any[] = []
  if (user) {
    const propertiesQuery = await payloadClient.find({
      collection: 'properties',
      where: {
        addedBy: { equals: user.id },
      },
      limit: 100, // For now, list up to 100
    })
    properties = propertiesQuery.docs
  }

  return (
    <div className={`wrapper ${styles.dashboardContainer}`}>
      <div className={styles.header}>
        <Heading2>My Properties</Heading2>
        <Button href="/dashboard/add" color="accent">
          Add Property
        </Button>
      </div>

      {properties.length === 0 ? (
        <div className={styles.emptyState}>
          <Heading3>No properties yet</Heading3>
          <Body>You haven't added any properties yet. Click the button above to get started.</Body>
        </div>
      ) : (
        <div className={styles.grid}>
          {properties.map((property) => (
            <DashboardPropertyCard
              key={property.id}
              property={{
                id: property.id,
                title: property.title,
                price: property.price,
                location: property.location,
                status: property.status,
                slug: property.slug,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
