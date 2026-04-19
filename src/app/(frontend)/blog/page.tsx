import Link from 'next/link'
import type { Blog } from '@/payload-types'
import { Heading1, Body } from '@/app/(frontend)/components/Text/Text'
import { BlogCard } from '@/app/(frontend)/components/BlogCard'
import styles from './BlogListPage.module.css'
import { payloadClient } from '@/app/lib/payloadClient'
import { unstable_cache } from 'next/cache'

const getPosts = unstable_cache(
  async () => {
    const data = await payloadClient.find({
      collection: 'blog',
      sort: '-createdAt',
      depth: 1, // Add depth to populate relationships
      limit: 10,
    })

    return data
  },
  ['blog-posts-list'],
  { tags: ['blog'] },
)

const BlogListPage = async () => {
  let posts: Blog[] = []
  let totalDocs = 0

  try {
    const result = await getPosts()
    posts = result.docs
    totalDocs = result.totalDocs
  } catch (error) {
    console.error('Error fetching blog posts:', error)
  }

  return (
    <div className={styles.blogListPage}>
      <div className={`wrapper ${styles.contentWrapper}`}>
        <header className={styles.pageHeader}>
          <span className={styles.eyebrow}>Real Estate News</span>
          <Heading1>Our Blog</Heading1>
          <Body className={styles.pageDescription}>
            Stay updated with the latest real estate insights, market trends, and expert tips.
          </Body>
        </header>

        {posts.length > 0 ? (
          <>
            <div className={styles.summaryBar}>
              <Body className={styles.summaryText}>
                Showing {posts.length} of {totalDocs} articles
              </Body>
            </div>

            <div className={styles.blogGrid}>
              {posts.map((post) => (
                <div key={post.id} className={styles.cardWrapper}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <Heading1>No blog posts published yet</Heading1>
            <Body className={styles.emptyDescription}>
              New articles will appear here as soon as they are published.
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

export default BlogListPage
