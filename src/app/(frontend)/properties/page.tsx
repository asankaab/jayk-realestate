import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import type { Property } from '@/payload-types'
import { payloadClient } from '@/app/lib/payloadClient'
import { PropertyCard } from '@/app/(frontend)/components/PropertyCard'
import { Body, Heading1 } from '@/app/(frontend)/components/Text/Text'
import styles from './PropertiesPage.module.css'

const PROPERTIES_PER_PAGE = 8

const getProperties = unstable_cache(
  async (page: number) => {
    return payloadClient.find({
      collection: 'properties',
      depth: 1,
      sort: '-createdAt',
      limit: PROPERTIES_PER_PAGE,
      page,
    })
  },
  ['properties-list'],
  { tags: ['properties'] },
)

const sanitizePage = (value?: string | string[]) => {
  const rawValue = Array.isArray(value) ? value[0] : value
  const parsed = Number(rawValue)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return Math.floor(parsed)
}

const buildPageHref = (page: number) => {
  return page === 1 ? '/properties' : `/properties?page=${page}`
}

type PropertiesPageProps = {
  searchParams: Promise<{
    page?: string | string[]
  }>
}

const PropertiesPage = async ({ searchParams }: PropertiesPageProps) => {
  const resolvedSearchParams = await searchParams
  const requestedPage = sanitizePage(resolvedSearchParams.page)

  let properties: Property[] = []
  let totalDocs = 0
  let totalPages = 1
  let currentPage = requestedPage

  try {
    const result = await getProperties(requestedPage)

    properties = result.docs
    totalDocs = result.totalDocs
    totalPages = Math.max(result.totalPages, 1)
    currentPage = Math.min(requestedPage, totalPages)

    if (requestedPage !== currentPage) {
      const clampedResult = await getProperties(currentPage)
      properties = clampedResult.docs
    }
  } catch (error) {
    console.error('Error fetching properties:', error)
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  const previousPage = Math.max(currentPage - 1, 1)
  const nextPage = Math.min(currentPage + 1, totalPages)
  const showingFrom = totalDocs === 0 ? 0 : (currentPage - 1) * PROPERTIES_PER_PAGE + 1
  const showingTo = Math.min(currentPage * PROPERTIES_PER_PAGE, totalDocs)

  return (
    <div className={styles.propertiesPage}>
      <div className={`wrapper ${styles.contentWrapper}`}>
        <header className={styles.pageHeader}>
          <span className={styles.eyebrow}>Available Properties</span>
          <Heading1>Find the right place to call home</Heading1>
          <Body className={styles.pageDescription}>
            Browse our latest listings for homes, rentals, and featured opportunities across
            sought-after neighborhoods.
          </Body>
        </header>

        {properties.length > 0 ? (
          <>
            <div className={styles.summaryBar}>
              <Body className={styles.summaryText}>
                Showing {showingFrom}-{showingTo} of {totalDocs} properties
              </Body>
            </div>

            <div className={styles.propertiesGrid}>
              {properties.map((property) => (
                <div key={property.id} className={styles.cardWrapper}>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <nav className={styles.pagination} aria-label="Properties pagination">
                <Link
                  href={buildPageHref(previousPage)}
                  aria-disabled={currentPage === 1}
                  className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
                >
                  Previous
                </Link>

                <div className={styles.pageNumbers}>
                  {pageNumbers.map((pageNumber) => (
                    <Link
                      key={pageNumber}
                      href={buildPageHref(pageNumber)}
                      aria-current={pageNumber === currentPage ? 'page' : undefined}
                      className={`${styles.pageNumber} ${pageNumber === currentPage ? styles.pageNumberActive : ''}`}
                    >
                      {pageNumber}
                    </Link>
                  ))}
                </div>

                <Link
                  href={buildPageHref(nextPage)}
                  aria-disabled={currentPage === totalPages}
                  className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ''}`}
                >
                  Next
                </Link>
              </nav>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            <Heading1>No properties available right now</Heading1>
            <Body className={styles.emptyDescription}>
              New listings will appear here as soon as they are published.
            </Body>
            <Link href="/" className={styles.homeLink}>
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertiesPage
