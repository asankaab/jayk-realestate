import Link from 'next/link'
import type { Blog } from '@/payload-types'
import { Heading1, Body } from '@/app/(frontend)/components/Text/Text'
import { BlogCard } from '@/app/(frontend)/components/BlogCard'
import styles from './BlogListPage.module.css'
import { headers } from 'next/headers'
import { payloadFetchClient } from '@/app/lib/payloadFetchClient'
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
      <div className={`wrapper ${styles.blogListWrapper}`}>
        <header className={styles.pageHeader}>
          <Heading1>Our Blog</Heading1>
          <Body className={styles.pageDescription}>
            Stay updated with the latest real estate insights, market trends, and expert tips
          </Body>
        </header>

        {posts.length > 0 ? (
          <>
            <div className={styles.blogGrid}>
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <Body className={styles.totalPosts}>
              Showing {posts.length} of {totalDocs} articles
            </Body>
          </>
        ) : (
          <div className={styles.noContent}>
            <Body>No blog posts published yet.</Body>
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
