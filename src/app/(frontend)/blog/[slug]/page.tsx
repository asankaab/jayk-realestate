import React from 'react'
import { notFound } from 'next/navigation'
import type { Blog } from '@/payload-types'
import { payloadClient } from '@/app/lib/payloadClient'
import { RichText } from '@/app/(frontend)/components/RichText/RichText'
import { ArrowLeft, Calendar, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { Heading1, Heading2, Heading3, Body } from '@/app/(frontend)/components/Text/Text'
import { RevealEmail } from '@/app/(frontend)/components/RevealEmail'
import styles from './BlogPostPage.module.css'

const BlogPostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  let post: Blog | null = null
  let relatedPosts: Blog[] = []
  const { slug } = await params

  try {
    // Fetch the blog post
    const postFind = await payloadClient.find({
      collection: 'blog',
      depth: 2,
      where: {
        slug: {
          equals: slug,
        },
        status: {
          equals: 'published',
        },
      },
    })
    post = postFind.docs[0]

    // Fetch related posts from same category (if applicable)
    if (post && post.category) {
      const relatedFind = await payloadClient.find({
        collection: 'blog',
        depth: 1,
        limit: 3,
        sort: '-createdAt',
        where: {
          and: [
            {
              status: {
                equals: 'published',
              },
            },
            {
              category: {
                equals: post.category,
              },
            },
            {
              slug: {
                not_equals: slug,
              },
            },
          ],
        },
      })
      relatedPosts = relatedFind.docs
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return notFound()
  }

  if (!post) {
    return notFound()
  }

  const author = typeof post.author === 'object' ? post.author : null
  const authorName = author ? `${author.firstName} ${author.lastName || ''}`.trim() : null

  return (
    <article className={styles.blogPostPage}>
      <div className={`wrapper ${styles.blogPostWrapper}`}>
        <Link href="/#blog" className={styles.backLink}>
          <ArrowLeft size={20} />
          <span>Back to Blog</span>
        </Link>

        <header className={styles.postHeader}>
          <Heading1 className={styles.postTitle}>{post.title}</Heading1>

          <div className={styles.postMeta}>
            {post.createdAt && (
              <div className={styles.metaItem}>
                <Calendar size={16} />
                <span>
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}

            {author && (
              <div className={styles.metaItem}>
                <UserIcon size={16} />
                <span>{authorName}</span>
              </div>
            )}

            {post.category && <span className={styles.category}>{post.category}</span>}
          </div>
        </header>

        <div className={styles.postContent}>
          {post.excerpt && <Body className={styles.excerpt}>{post.excerpt}</Body>}

          {post.content && (
            <div className={styles.richTextContent}>
              <RichText data={post.content} />
            </div>
          )}
        </div>

        {author && (
          <div className={styles.authorSection}>
            <div className={styles.authorInfo}>
              <UserIcon size={48} className={styles.authorIcon} />
              <div>
                <Heading3 className={styles.authorName}>{authorName}</Heading3>
                <RevealEmail email={author.email} />
                <Body className={styles.authorBio}>Guest Author</Body>
              </div>
            </div>
          </div>
        )}
      </div>

      {relatedPosts.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={`wrapper ${styles.relatedWrapper}`}>
            <Heading2 className={styles.relatedTitle}>Related Articles</Heading2>
            <div className={styles.relatedGrid}>
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className={styles.relatedCard}
                >
                  <Heading3>{relatedPost.title}</Heading3>
                  <Body>{relatedPost.excerpt}</Body>
                  <span className={styles.readMore}>Read More →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}

export default BlogPostPage
