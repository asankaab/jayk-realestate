import React from 'react'

const PropertyDetailsPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  // TODO: Fetch property data from Payload
  const property = {
    title: 'Beautiful Family Home',
    status: 'For Sale',
    description: '<p>A beautiful and spacious family home in a great neighborhood.</p>',
    price: 500000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    location: '123 Main St, Anytown, USA',
    images: [],
  }

  if (!property) {
    return <div>Property not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* TODO: Add image gallery */}
          <div className="bg-gray-200 h-96 mb-4"></div>
        </div>
        <div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-2xl font-bold text-green-600 mb-4">${property.price.toLocaleString()}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <p><span className="font-bold">Bedrooms:</span> {property.bedrooms}</p>
              <p><span className="font-bold">Bathrooms:</span> {property.bathrooms}</p>
              <p><span className="font-bold">Area:</span> {property.area} sq. ft.</p>
              <p><span className="font-bold">Status:</span> {property.status}</p>
            </div>
            <p className="mb-4"><span className="font-bold">Location:</span> {property.location}</p>
            <h2 className="text-2xl font-bold mb-2">Description</h2>
            <div dangerouslySetInnerHTML={{ __html: property.description }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailsPage
