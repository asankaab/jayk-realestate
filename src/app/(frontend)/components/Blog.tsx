import React from 'react'
import styles from './Blog.module.css'
import { SectionTitle } from './Text/Text'
import { payloadClient } from '@/app/lib/payloadClient'
import Button from './Button'
import { BlogCard } from './BlogCard'

export const Blog = async () => {
  const { docs: posts } = await payloadClient.find({
    collection: 'blog',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-createdAt',
    limit: 6,
    depth: 1,
  })

  if (!posts || posts.length === 0) {
    return null
  }
  return (
    <section className={styles.blogSection} id="blog">
      <div className={`wrapper ${styles.blogContent}`}>
        <SectionTitle className={styles.sectionTitle}>Blog</SectionTitle>

        <div className={styles.blogGrid}>
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div className={styles.ctaContainer}>
          <Button href="/blog" fill="filled" color="primary">
            Read More Blog...
          </Button>
        </div>
      </div>
    </section>
  )
}
