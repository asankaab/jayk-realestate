import React from 'react'
import { notFound } from 'next/navigation'
import { ImageGallery } from './ImageGallery'
import type { Media, Property } from '@/payload-types'
import { payloadClient } from '@/app/lib/payloadClient'

const PropertyDetailsPage = async ({ params }: { params: { id: string } }) => {
  let property: Property | null = null
  const { id } = await params
  try {
    property = await payloadClient.findByID({
      collection: 'properties',
      id,
      depth: 1,
    })
  } catch (error) {
    console.error('Error fetching property:', error)
    return notFound()
  }

  if (!property) {
    return notFound()
  }

  const images = (property.images as Media[] | undefined)?.filter(
    (img): img is Media => typeof img === 'object' && img !== null,
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ImageGallery images={images || []} title={property.title} />
        </div>
        <div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-2xl font-bold text-green-600 mb-4">
              ${property.price.toLocaleString()}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <p>
                <span className="font-bold">Bedrooms:</span> {property.bedrooms}
              </p>
              <p>
                <span className="font-bold">Bathrooms:</span> {property.bathrooms}
              </p>
              <p>
                <span className="font-bold">Area:</span> {property.area} sq. ft.
              </p>
              <p>
                <span className="font-bold">Status:</span> {property.status}
              </p>
            </div>
            <p className="mb-4">
              <span className="font-bold">Location:</span> {property.location}
            </p>
            <h2 className="text-2xl font-bold mb-2">Description</h2>
            {/* Proper lexical renderer should be used here */}
            {property.description && (
              <div dangerouslySetInnerHTML={{ __html: JSON.stringify(property.description) }} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailsPage
