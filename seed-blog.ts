import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

/**
 * Seed blog data into the database
 * Run with: npx tsx seed-blog.ts
 */
async function seedBlog() {
  try {
    const payload = await getPayload({ config })

    // First, check if a seeded user exists, or create one
    let author = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'author@example.com',
        },
      },
      limit: 1,
    })

    let authorId: string

    if (author.docs.length === 0) {
      console.log('Creating author user...')
      const newAuthor = await payload.create({
        collection: 'users',
        data: {
          email: 'author@example.com',
          password: 'SecurePassword123!',
          roles: ['author'],
        },
      })
      authorId = newAuthor.id
      console.log(`✓ Created author user with ID: ${authorId}`)
    } else {
      authorId = author.docs[0].id
      console.log(`✓ Using existing author user with ID: ${authorId}`)
    }

    // Sample blog posts data
    const blogPosts = [
      {
        title: 'Top 5 Real Estate Investment Strategies in 2025',
        category: 'Investment',
        status: 'published',
        featured: true,
        excerpt:
          'Discover the best real estate investment strategies for maximizing returns in 2025. From fix-and-flip projects to rental properties, learn how to grow your wealth.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Real estate investment continues to be one of the most reliable ways to build long-term wealth. In 2025, the market presents unique opportunities for investors who understand current trends.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: '1. Diversify Your Portfolio',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Consider mixing residential and commercial properties to spread risk and maximize income potential.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: '2. Focus on Emerging Markets',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Up-and-coming neighborhoods often offer better returns as they develop and attract more residents.',
                  },
                ],
              },
            ],
          },
        },
      },
      {
        title: 'Understanding Market Trends: A Guide for Home Buyers',
        category: 'Market Insights',
        status: 'published',
        featured: false,
        excerpt:
          'Stay informed about current real estate market trends. Learn how interest rates, inventory levels, and economic factors affect your home buying decisions.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Understanding real estate market trends is crucial for making informed buying decisions. This guide covers the key indicators that influence property values and market conditions.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Interest Rates Impact',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Mortgage rates directly affect buyer purchasing power and can significantly influence property demand and prices.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Inventory Levels',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Low inventory typically favors sellers, while higher supply gives buyers more negotiating power and options to choose from.',
                  },
                ],
              },
            ],
          },
        },
      },
      {
        title: 'First-Time Home Buyer Tips: Everything You Need to Know',
        category: 'Property Guides',
        status: 'published',
        featured: false,
        excerpt:
          'New to home buying? Our comprehensive guide covers mortgage pre-approval, home inspection, closing costs, and everything in between.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Buying your first home is an exciting milestone. This comprehensive guide will walk you through each step of the process to help you make confident decisions.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Get Pre-Approved for a Mortgage',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Before house hunting, get pre-approved to understand your budget and show sellers you are a serious buyer.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Schedule a Home Inspection',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Always hire a professional inspector to identify any potential issues before making an offer.',
                  },
                ],
              },
            ],
          },
        },
      },
      {
        title: 'How to Increase Your Homes Value: Renovation Tips',
        category: 'Real Estate Tips',
        status: 'published',
        featured: false,
        excerpt:
          'Smart renovations can significantly increase your home value. Learn which upgrades provide the best ROI and which to avoid.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Strategic renovations can dramatically boost your homes market value. Focus on upgrades that buyers want most.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Kitchen and Bathroom Upgrades',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'These spaces offer the highest ROI when renovated. Modern fixtures and finishes can add 60-80% of renovation costs back to home value.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Energy-Efficient Windows and Insulation',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Energy-efficient upgrades are both attractive to buyers and can lower utility costs, making them a smart investment.',
                  },
                ],
              },
            ],
          },
        },
      },
      {
        title: 'Commercial Real Estate Market Update',
        category: 'News',
        status: 'published',
        featured: false,
        excerpt:
          'The latest developments in commercial real estate. Office space demand evolves, retail adapts, and industrial properties remain strong.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'The commercial real estate sector continues to evolve rapidly in response to changing work patterns and consumer behavior.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Office Space Transformation',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'With remote work becoming mainstream, office spaces are being reimagined for collaboration and flexibility.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Industrial Property Boom',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'E-commerce growth continues to drive demand for warehouse and logistics facilities across the country.',
                  },
                ],
              },
            ],
          },
        },
      },
      {
        title: 'The Impact of Location on Property Value',
        category: 'Market Insights',
        status: 'published',
        featured: false,
        excerpt:
          'Location is everything in real estate. Discover how proximity to amenities, schools, and transportation affects your property investment.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'The age-old real estate mantra "location, location, location" holds true more than ever. Property value is fundamentally tied to its geographic position.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Proximity to Schools',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Neighborhoods with highly-rated schools consistently see higher property values and faster appreciation.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Public Transportation Access',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Properties near public transportation are highly sought after, especially in urban areas where commuting is essential.',
                  },
                ],
              },
            ],
          },
        },
      },
      {
        title: 'Staging Your Home for a Quick Sale',
        category: 'Real Estate Tips',
        status: 'published',
        featured: true,
        excerpt:
          'Learn professional staging techniques to showcase your home in the best light and attract serious buyers quickly.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Home staging is the art of preparing your property for sale by presenting it in its best possible light. Proper staging can significantly reduce time on market.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Declutter and Depersonalize',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Remove personal items and excess furniture to help buyers visualize themselves living in the space.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Fresh Paint and Lighting',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Neutral paint colors and good lighting make spaces feel larger and more welcoming to potential buyers.',
                  },
                ],
              },
            ],
          },
        },
      },
      {
        title: 'Real Estate Negotiation Tactics: Getting the Best Deal',
        category: 'Property Guides',
        status: 'published',
        featured: false,
        excerpt:
          'Master the art of negotiation in real estate transactions. Proven strategies to help you get the best price whether buying or selling.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Negotiation is a critical skill in real estate. Whether you are buying or selling, knowing how to negotiate effectively can save or earn you thousands of dollars.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Know Your Market Value',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Research comparable properties in the area to establish a strong baseline for negotiations.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Get Pre-Approved Before Negotiating',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Having mortgage pre-approval strengthens your negotiating position and shows sellers you are a qualified buyer.',
                  },
                ],
              },
            ],
          },
        },
      },
      {
        title: 'Tax Benefits of Real Estate Investment',
        category: 'Investment',
        status: 'published',
        featured: false,
        excerpt:
          'Maximize your returns by understanding real estate tax deductions, depreciation, and other tax advantages for property investors.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Real estate offers unique tax advantages that can significantly boost your investment returns. Understanding these benefits is crucial for every property investor.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Mortgage Interest Deductions',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'You can deduct the interest portion of your mortgage payments, which is a substantial tax advantage for investors with financing.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Depreciation Benefits',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Depreciation allows you to deduct a portion of the property value each year, even if the property is appreciating.',
                  },
                ],
              },
            ],
          },
        },
      },
    ]

    // Get the author user for context so beforeValidate hook runs
    const authorUser = await payload.findByID({
      collection: 'users',
      id: authorId as string,
      depth: 0,
    })

    console.log('\nSeeding blog posts...')
    for (const post of blogPosts) {
      try {
        const created = await payload.create({
          collection: 'blog',
          data: {
            title: post.title,
            category: post.category,
            status: post.status,
            featured: post.featured,
            excerpt: post.excerpt,
            content: post.content,
            author: authorId,
          },
          user: authorUser, // Pass user context for proper hook execution
          overrideAccess: false, // Respect access control with user context
        })
        console.log(`✓ Created: "${created.title}"`)
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message.includes('unique constraint') ||
            error.message.includes('already exists') ||
            error.message.includes('duplicate'))
        ) {
          console.log(`⊘ Skipped: "${post.title}" (already exists)`)
        } else if (error instanceof Error) {
          console.log(`⊘ Skipped: "${post.title}" (${error.message.substring(0, 100)})`)
        } else {
          throw error
        }
      }
    }

    console.log('\n✅ Blog seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding blog data:', error)
    process.exit(1)
  }
}

seedBlog()
