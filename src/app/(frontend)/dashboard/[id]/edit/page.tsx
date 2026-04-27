import { notFound } from 'next/navigation'
import { payloadClient } from '@/app/lib/payloadClient'
import { updateProperty } from '../../actions'
import { PropertyForm } from '../../PropertyForm'
import { auth } from '@clerk/nextjs/server'

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()

  if (!userId) {
    notFound()
  }

  const userQuery = await payloadClient.find({
    collection: 'users',
    where: { clerkId: { equals: userId } },
  })
  
  const user = userQuery.docs[0]
  if (!user) {
    notFound()
  }

  let property
  try {
    property = await payloadClient.findByID({
      collection: 'properties',
      id,
    })
  } catch (error) {
    notFound()
  }

  // Ensure the logged in user is the one who added the property
  const addedById = typeof property.addedBy === 'object' ? property.addedBy.id : property.addedBy
  if (addedById !== user.id) {
    notFound()
  }

  return (
    <div className="wrapper" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <PropertyForm 
        onSubmit={updateProperty.bind(null, id)} 
        title="Edit Property" 
        initialData={{
          id: String(property.id),
          title: property.title,
          status: property.status,
          price: property.price,
          location: property.location,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          images: Array.isArray(property.images) 
            ? property.images.map((img: any) => 
                typeof img === 'object' ? { id: img.id, url: img.url } : { id: img, url: '' }
              ).filter(img => img.url)
            : [],
        }}
      />
    </div>
  )
}
