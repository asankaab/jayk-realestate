import React from 'react'
import Link from 'next/link'
import type { Blog } from '@/payload-types'
import { payloadClient } from '@/app/lib/payloadClient'
import { Heading1, Body } from '@/app/(frontend)/components/Text/Text'
import { BlogCard } from '@/app/(frontend)/components/BlogCard'
import styles from './BlogListPage.module.css'

const BlogListPage = async () => {
  let posts: Blog[] = []
  let totalDocs = 0

  try {
    const result = await payloadClient.find({
      collection: 'blog',
      where: {
        status: {
          equals: 'published',
        },
      },
      sort: '-createdAt',
      limit: 20,
      depth: 1,
    })
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
