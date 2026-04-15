import React from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { Heading3, Body } from './Text/Text'
import type { Blog } from '@/payload-types'
import styles from './Blog.module.css'

interface BlogCardProps {
  post: Blog
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className={styles.blogCard}>
      <Link href={`/blog/${post.slug || post.id}`}>
        <Heading3 className={styles.blogTitle}>{post.title}</Heading3>
      </Link>

      {post.createdAt && (
        <Body className={styles.publishDate}>
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Body>
      )}

      <Body className={styles.excerpt}>{post.excerpt}</Body>

      <Link href={`/blog/${post.slug || post.id}`} className={styles.readMore}>
        <span>Read More</span>
        <ArrowRightIcon size={16} />
      </Link>
    </article>
  )
}
