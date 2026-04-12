import React from 'react'
import Button from './Button'
import styles from './Blog.module.css'
import { ArrowRightIcon } from 'lucide-react'
import { SectionTitle } from './Text/Text'
import { payloadClient } from '../../lib/payloadClient'
import type { Blog as BlogPost } from '@/payload-types'

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
    <section className={styles.blogSection}>
      <div className={`wrapper ${styles.blogContent}`}>
        <SectionTitle className={styles.sectionTitle}>Blog</SectionTitle>

        <div className={styles.blogGrid}>
          {posts.map((post) => (
            <article key={post.id} className={styles.blogCard}>
              <h3 className={styles.blogTitle}>{post.title}</h3>

              {post.createdAt && (
                <p className={styles.publishDate}>
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}

              <p className={styles.excerpt}>{post.excerpt}</p>

              <a href={`/blog/${post.slug || post.id}`} className={styles.readMore}>
                <span>Read More</span>
                <ArrowRightIcon size={16} />
              </a>
            </article>
          ))}
        </div>

        <div className={styles.ctaContainer}>
          <Button className={styles.readMoreButton}>Read More Blog...</Button>
        </div>
      </div>
    </section>
  )
}
