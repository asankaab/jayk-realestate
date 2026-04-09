'use client'
import React from 'react'
import Button from './Button'
import styles from './Blog.module.css'
import { ChevronRight } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author?: {
    name: string
    avatar?: string
  }
  publishedAt?: string
  slug?: string
}

interface BlogProps {
  posts?: BlogPost[]
}

export const Blog: React.FC<BlogProps> = ({
  posts = [
    {
      id: '1',
      title: 'Navigating Real Estate as a Global Buyer: Tips for Success',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur. Vestibulum nisl purus et...',
      author: {
        name: 'Jay Kendall',
        avatar: undefined,
      },
      publishedAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Navigating Real Estate as a Global Buyer: Tips for Success',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur. Vestibulum nisl purus et...',
      author: {
        name: 'Jay Kendall',
        avatar: undefined,
      },
      publishedAt: '2024-01-15',
    },
    {
      id: '3',
      title: 'Navigating Real Estate as a Global Buyer: Tips for Success',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur. Vestibulum nisl purus et...',
      author: {
        name: 'Jay Kendall',
        avatar: undefined,
      },
      publishedAt: '2024-01-15',
    },
    {
      id: '4',
      title: 'Navigating Real Estate as a Global Buyer: Tips for Success',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur. Vestibulum nisl purus et...',
      author: {
        name: 'Jay Kendall',
        avatar: undefined,
      },
      publishedAt: '2024-01-15',
    },
    {
      id: '5',
      title: 'Navigating Real Estate as a Global Buyer: Tips for Success',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur. Vestibulum nisl purus et...',
      author: {
        name: 'Jay Kendall',
        avatar: undefined,
      },
      publishedAt: '2024-01-15',
    },
    {
      id: '6',
      title: 'Navigating Real Estate as a Global Buyer: Tips for Success',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur. Vestibulum nisl purus et...',
      author: {
        name: 'Jay Kendall',
        avatar: undefined,
      },
      publishedAt: '2024-01-15',
    },
  ],
}) => {
  const getAuthorInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <section className={styles.blogSection}>
      <div className={`wrapper ${styles.blogContent}`}>
        <h2 className={styles.sectionTitle}>Blog</h2>

        <div className={styles.blogGrid}>
          {posts.map((post) => (
            <article key={post.id} className={styles.blogCard}>
              <h3 className={styles.blogTitle}>{post.title}</h3>

              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  {post.author?.avatar ? (
                    <img src={post.author.avatar} alt={post.author.name} />
                  ) : (
                    <span className={styles.initials}>
                      {post.author?.name ? getAuthorInitials(post.author.name) : 'JK'}
                    </span>
                  )}
                </div>
                <div className={styles.authorDetails}>
                  <p className={styles.authorName}>{post.author?.name || 'Author'}</p>
                  {post.publishedAt && (
                    <p className={styles.publishDate}>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>

              <p className={styles.excerpt}>{post.excerpt}</p>

              <a href={`/blog/${post.slug || post.id}`} className={styles.readMore}>
                <span>Read More</span>
                <ChevronRight size={16} />
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
