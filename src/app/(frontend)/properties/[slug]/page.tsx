import React from 'react'
import { notFound } from 'next/navigation'
import { ImageGallery } from './ImageGallery'
import { ContactForm } from './ContactForm'
import type { Media, Property } from '@/payload-types'
import { payloadClient } from '@/app/lib/payloadClient'
import { FeaturedProperties } from '@/app/(frontend)/components/FeaturedProperties'
import { RichText } from '@/app/(frontend)/components/RichText/RichText'
import { Heart, Share2 } from 'lucide-react'
import { RevealEmail } from '@/app/(frontend)/components/RevealEmail'
import styles from './ProductPage.module.css'

const PropertyDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  let property: Property | null = null
  let featuredProperties: Property[] = []
  const { slug } = await params

  try {
    const propertyFind = await payloadClient.find({
      collection: 'properties',
      depth: 1,
      where: {
        slug: {
          equals: slug,
        },
      },
    })
    property = propertyFind.docs[0]

    // Fetch featured properties (limit to 8 excluding current property)
    const featuredFind = await payloadClient.find({
      collection: 'properties',
      depth: 1,
      limit: 8,
      where: {
        slug: {
          not_equals: slug,
        },
      },
    })
    featuredProperties = featuredFind.docs
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

  const addedByUser = typeof property.addedBy === 'object' ? property.addedBy : null
  const addedByName = addedByUser
    ? `${addedByUser.firstName} ${addedByUser.lastName || ''}`.trim()
    : null

  return (
    <>
      <div className={styles.heroSection}>
        <div className="wrapper">
          <div className={styles.mainContent}>
            <div className={styles.imageSection}>
              <ImageGallery images={images || []} title={property.title} />
            </div>

            <div className={styles.detailsSection}>
              <div className={styles.priceAndTags}>
                <div className={styles.priceLocation}>
                  <p className={styles.price}>${property.price.toLocaleString()}</p>
                  <p className={styles.location}>{property.title}</p>
                  <div className={styles.tags}>
                    <span className={styles.tag}>{property.status}</span>
                    <span className={styles.tag}>Full Furniture</span>
                  </div>
                </div>
                <div className={styles.actionsBar}>
                  <button className={styles.actionButton}>
                    <Heart size={20} />
                  </button>
                  <button className={styles.actionButton}>
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className={styles.description}>
                {property.description && <RichText data={property.description} />}
                <p className={styles.descriptionText}>
                  Experience luxury living in this stunning property. Situated in a prime location,
                  this exquisite residence offers the perfect blend of comfort and elegance. With
                  spacious rooms, modern amenities, and beautiful architectural details, this is
                  your dream home awaiting.
                </p>
              </div>

              <div className={styles.featuresGrid}>
                <div className={styles.feature}>
                  <span className={styles.featureLabel}>Bedrooms</span>
                  <span className={styles.featureValue}>{property.bedrooms ?? '-'}</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureLabel}>Bathrooms</span>
                  <span className={styles.featureValue}>{property.bathrooms ?? '-'}</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureLabel}>Area</span>
                  <span className={styles.featureValue}>
                    {property.area ? `${property.area} sq. ft.` : '-'}
                  </span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureLabel}>Status</span>
                  <span className={styles.featureValue}>{property.status}</span>
                </div>
              </div>

              <div className={styles.addedBy}>
                <div className={styles.feature} style={{ marginTop: '1.5rem' }}>
                  <span className={styles.featureLabel}>Added By</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className={styles.featureValue}>{addedByName}</span>
                    {addedByUser?.email && <RevealEmail email={addedByUser.email} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactForm propertyTitle={property.title} />

      {featuredProperties.length > 0 && (
        <div className={styles.featuredSection}>
          <div className="wrapper">
            <h2 className={styles.sectionTitle}>Featured Listings</h2>
            <FeaturedProperties properties={featuredProperties} />
          </div>
        </div>
      )}
    </>
  )
}

export default PropertyDetailsPage
