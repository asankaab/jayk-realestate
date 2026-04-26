import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'
import type { Property } from '@/payload-types'
import { payloadClient } from '@/app/lib/payloadClient'
import { PropertyCard } from '@/app/(frontend)/components/PropertyCard'
import { PropertyCardSkeleton } from '@/app/(frontend)/components/PropertyCardSkeleton'
import { SearchInput } from './SearchInput'
import { Body, Heading1 } from '@/app/(frontend)/components/Text/Text'
import styles from './PropertiesPage.module.css'
import Button from '../components/Button'

const PROPERTIES_PER_PAGE = 8

const getProperties = unstable_cache(
  async (page: number, query?: string) => {
    return payloadClient.find({
      collection: 'properties',
      depth: 1,
      sort: '-createdAt',
      limit: PROPERTIES_PER_PAGE,
      page,
      ...(query
        ? {
            where: {
              or: [{ title: { like: query } }, { location: { like: query } }],
            },
          }
        : {}),
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

const buildPageHref = (page: number, query?: string) => {
  const params = new URLSearchParams()
  if (page > 1) {
    params.set('page', page.toString())
  }
  if (query) {
    params.set('q', query)
  }
  const queryString = params.toString()
  return queryString ? `/properties?${queryString}` : '/properties'
}

type PropertiesPageProps = {
  searchParams: Promise<{
    page?: string | string[]
    q?: string | string[]
  }>
}

const PropertiesListSkeleton = () => {
  return (
    <>
      <div className={styles.summaryBar}>
        <Body className={styles.summaryText}>
          <span style={{ opacity: 0 }}>&nbsp;</span>
        </Body>
      </div>
      <div className={styles.propertiesGrid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.cardWrapper}>
            <PropertyCardSkeleton />
          </div>
        ))}
      </div>
    </>
  )
}

const PropertiesList = async ({
  query,
  requestedPage,
}: {
  query?: string
  requestedPage: number
}) => {
  let properties: Property[] = []
  let totalDocs = 0
  let totalPages = 1
  let currentPage = requestedPage

  try {
    const result = await getProperties(requestedPage, query)

    properties = result.docs
    totalDocs = result.totalDocs
    totalPages = Math.max(result.totalPages, 1)
    currentPage = Math.min(requestedPage, totalPages)

    if (requestedPage !== currentPage) {
      const clampedResult = await getProperties(currentPage, query)
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

  if (properties.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Heading1>No properties available right now</Heading1>
        <Body className={styles.emptyDescription}>
          {query
            ? `No listings found for "${query}". Try adjusting your search.`
            : 'New listings will appear here as soon as they are published.'}
        </Body>
        <Button color="accent" href="/properties" replace>
          {query ? 'Clear Search' : 'Back to Home'}
        </Button>
      </div>
    )
  }

  return (
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
            replace
            href={buildPageHref(previousPage, query)}
            aria-disabled={currentPage === 1}
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
          >
            Previous
          </Link>

          <div className={styles.pageNumbers}>
            {pageNumbers.map((pageNumber) => (
              <Link
                replace
                key={pageNumber}
                href={buildPageHref(pageNumber, query)}
                aria-current={pageNumber === currentPage ? 'page' : undefined}
                className={`${styles.pageNumber} ${pageNumber === currentPage ? styles.pageNumberActive : ''}`}
              >
                {pageNumber}
              </Link>
            ))}
          </div>

          <Link
            replace
            href={buildPageHref(nextPage, query)}
            aria-disabled={currentPage === totalPages}
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ''}`}
          >
            Next
          </Link>
        </nav>
      )}
    </>
  )
}

const PropertiesPage = async ({ searchParams }: PropertiesPageProps) => {
  const resolvedSearchParams = await searchParams
  const requestedPage = sanitizePage(resolvedSearchParams.page)
  const queryParam = resolvedSearchParams.q
  const query =
    typeof queryParam === 'string'
      ? queryParam
      : Array.isArray(queryParam)
        ? queryParam[0]
        : undefined

  return (
    <div className={styles.propertiesPage}>
      <div className={`wrapper ${styles.contentWrapper}`}>
        <header className={styles.pageHeader}>
          <span className={styles.eyebrow}>Available Properties</span>
          <Heading1>Find the right place to call home</Heading1>
          <div
            className={styles.searchWrapper}
            style={{ marginTop: '2rem', width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <Suspense fallback={<div>Loading search...</div>}>
              <SearchInput />
            </Suspense>
          </div>
        </header>

        <Suspense key={`${query}-${requestedPage}`} fallback={<PropertiesListSkeleton />}>
          <PropertiesList query={query} requestedPage={requestedPage} />
        </Suspense>
      </div>
    </div>
  )
}

export default PropertiesPage
