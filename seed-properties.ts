import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

interface PropertyData {
  title: string
  status: 'For Sale' | 'For Rent' | 'Sold' | 'Leased'
  featured?: boolean
  description: any
  price: number
  bedrooms?: number
  bathrooms?: number
  area?: number
  location: string
  imageIds: number[]
}

async function seedProperties() {
  try {
    const payload = await getPayload({ config })

    // First, check if a seeded user exists
    const userQuery = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'asanka.abewickrama+jayk-user@gmail.com',
        },
      },
      limit: 1,
    })

    if (userQuery.docs.length === 0) {
      throw new Error('User not found. Please create the user first.')
    }

    const userId = userQuery.docs[0].id
    console.log(`✓ Using existing user with ID: ${userId}`)

    // Clear existing properties
    const existingProperties = await payload.find({
      collection: 'properties',
      limit: 100,
    })
    
    if (existingProperties.docs.length > 0) {
      console.log(`Clearing ${existingProperties.docs.length} existing properties...`)
      for (const doc of existingProperties.docs) {
        await payload.delete({
          collection: 'properties',
          id: doc.id,
        })
      }
      console.log('✓ Cleared existing properties')
    }

    // Get available media IDs
    const mediaQuery = await payload.find({
      collection: 'media',
      limit: 100,
    })
    const availableMediaIds = mediaQuery.docs.map(m => m.id as number)
    console.log(`✓ Found ${availableMediaIds.length} media items`)

    // Helper to get valid image IDs
    const getValidImageIds = (requestedIds: number[]) => {
      return requestedIds.filter(id => availableMediaIds.includes(id))
    }

    // Sample properties data
    const propertiesData: PropertyData[] = [
      {
        title: 'Luxurious Modern Downtown Penthouse',
        status: 'For Sale',
        location: 'Downtown Heritage District',
        price: 2500000,
        bedrooms: 3,
        bathrooms: 3,
        area: 3500,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Stunning penthouse apartment featuring floor-to-ceiling windows with panoramic city views. This modern luxury residence includes premium finishes, high-end appliances, and an expansive terrace perfect for entertaining.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Features',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Open-concept living, marble countertops, stainless steel appliances, radiant heating, smart home automation, and private elevator access.',
                  },
                ],
              },
            ],
          },
        },
        imageIds: getValidImageIds([125, 126, 127]),
      },
      {
        title: 'Contemporary Suburban Family Home',
        status: 'For Sale',
        location: 'Oak Ridge Neighborhood',
        price: 875000,
        bedrooms: 4,
        bathrooms: 2,
        area: 2800,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Beautiful modern home perfect for families. Features a spacious backyard, updated kitchen, and excellent school district access. Recently renovated with new roof, HVAC, and electrical.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Highlights',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Large deck, finished basement, two-car garage, mature landscaping, and proximity to parks and shopping.',
                  },
                ],
              },
            ],
          },
        },
        imageIds: getValidImageIds([128, 129, 130]),
      },
      {
        title: 'Cozy Village Cottage with Charm',
        status: 'For Sale',
        location: 'Maple Village',
        price: 450000,
        bedrooms: 2,
        bathrooms: 1,
        area: 1400,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Charming cottage-style home with original hardwood floors and character details. Recently updated kitchen and bathroom while maintaining vintage charm.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Character Features',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Original crown molding, fireplace with stone mantel, front porch, established gardens, and walking distance to downtown.',
                  },
                ],
              },
            ],
          },
        },
        imageIds: getValidImageIds([131, 132]),
      },
      {
        title: 'Historic Estate with Grounds',
        status: 'For Sale',
        location: 'Riverside Estate District',
        price: 3200000,
        bedrooms: 5,
        bathrooms: 4,
        area: 5600,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Grand historic estate situated on 3 acres with mature trees, private pond, and guest house. This iconic property features rich architectural details and period craftsmanship.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Amenities',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Library, formal dining, wine cellar, kitchen with breakfast room, master suite with spa, guest house, heated pool, and extensive grounds.',
                  },
                ],
              },
            ],
          },
        },
        imageIds: getValidImageIds([133, 134, 135, 136]),
      },
      {
        title: 'Urban Loft in Historic Building',
        status: 'For Sale',
        location: 'Arts District',
        price: 650000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1850,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Industrial-chic loft in a converted historic warehouse. Soaring ceilings, exposed brick, and massive windows flood the space with natural light.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Design Elements',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Polished concrete floors, stainless steel fixtures, open floor plan, rooftop access, and excellent location for dining and entertainment.',
                  },
                ],
              },
            ],
          },
        },
        imageIds: getValidImageIds([137, 138, 139]),
      },
      {
        title: 'Beachfront Villa with Ocean Views',
        status: 'For Sale',
        location: 'Coastal Shores',
        price: 2800000,
        bedrooms: 4,
        bathrooms: 3,
        area: 3300,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Spectacular beachfront villa offering direct ocean access and breathtaking views. Contemporary design with seamless indoor-outdoor living spaces.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Premier Features',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Infinity pool, beach access path, large deck with ocean views, floor-to-ceiling windows, modern kitchen, and spa-like master bath.',
                  },
                ],
              },
            ],
          },
        },
        imageIds: getValidImageIds([140, 141, 142, 143]),
      },
      {
        title: 'Spacious Ranch-Style Home',
        status: 'For Rent',
        location: 'Prairie Community',
        price: 3500,
        bedrooms: 3,
        bathrooms: 2,
        area: 2200,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Comfortable ranch-style home available for long-term rental. Well-maintained property with updated systems and family-friendly neighborhood.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Rental Amenities',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Fenced yard, one-car garage, central air conditioning, updated appliances, and convenient access to schools and shopping.',
                  },
                ],
              },
            ],
          },
        },
        imageIds: getValidImageIds([144, 145]),
      },
      {
        title: 'Downtown Luxury Apartment',
        status: 'For Rent',
        location: 'Central Business District',
        price: 4200,
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Premium luxury apartment in the heart of downtown. High-rise building with full amenities, concierge service, and walkable access to everything.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Building Amenities',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Fitness center, rooftop lounge, 24-hour concierge, secure parking, elevator access, and proximity to restaurants and entertainment.',
                  },
                ],
              },
            ],
          },
        },
        imageIds: getValidImageIds([146, 147]),
      },
      {
        title: 'Investment Duplex in Revitalizing Neighborhood',
        status: 'For Sale',
        location: 'Mission Heights',
        price: 725000,
        bedrooms: 4,
        bathrooms: 3,
        area: 3000,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Great investment opportunity with duplex units on separate lots. Recently renovated with potential for increased rental income as neighborhood appreciates.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Investment Highlights',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Currently generating income from tenants, new roof and plumbing, modern kitchen, strong neighborhood growth potential, and property tax benefits.',
                  },
                ],
              },
            ],
          },
        },
        imageIds: getValidImageIds([148, 149]),
      },
      {
        title: 'Garden Apartment in Quiet Complex',
        status: 'For Rent',
        location: 'Peaceful Gardens District',
        price: 1800,
        bedrooms: 1,
        bathrooms: 1,
        area: 750,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Charming garden-level apartment in a quiet residential complex. Perfect for single professionals or couples. Community includes manicured grounds and peaceful atmosphere.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Community Amenities',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Reserved parking, gardens with walking paths, month-to-month leases available, pet-friendly, and utility support included.',
                  },
                ],
              },
            ],
          },
        },
        imageIds: getValidImageIds([150, 151, 158]),
      },
      {
        title: 'Classic Victorian Mansion',
        status: 'Sold',
        location: 'Heritage Square',
        price: 1850000,
        bedrooms: 6,
        bathrooms: 4,
        area: 4200,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Fully restored Victorian mansion with original architectural details. This recently sold property represents a significant achievement in historic preservation.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Historic Restoration',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Restored stained glass windows, ornate fireplaces, hand-carved woodwork, period-appropriate materials, and maintained historical accuracy throughout.',
                  },
                ],
              },
            ],
          },
        },
        imageIds: getValidImageIds([152, 153]),
      },
      {
        title: 'Contemporary Studio Apartment',
        status: 'For Rent',
        location: 'Metro Station District',
        price: 1400,
        bedrooms: 0,
        bathrooms: 1,
        area: 550,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Efficient studio apartment perfect for urban professionals. Modern finishes, excellent light, and prime location near transit.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Perfect For',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'First-time renters, young professionals, or anyone wanting minimal space with maximum convenience and accessibility.',
                  },
                ],
              },
            ],
          },
        },
        imageIds: getValidImageIds([154]),
      },
      {
        title: 'Mountain Retreat with Forest Views',
        status: 'For Sale',
        location: 'Alpine Heights',
        price: 950000,
        bedrooms: 3,
        bathrooms: 2,
        area: 2100,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Serene mountain retreat offering privacy and natural beauty. This secluded home is surrounded by forest with stunning valley views.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  {
                    type: 'text',
                    text: 'Outdoor Living',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Large deck with panoramic views, fireplace for cozy evenings, hiking trail access, propane heating, and well water system.',
                  },
                ],
              },
            ],
          },
        },
        imageIds: getValidImageIds([155, 156]),
      },
    ]

    // Get the user for context so beforeValidate hook runs
    const contextUser = await payload.findByID({
      collection: 'users',
      id: userId,
      depth: 0,
    })

    console.log('Seeding properties...')
    for (const property of propertiesData) {
      try {
        const created = await payload.create({
          collection: 'properties',
          data: {
            title: property.title,
            status: property.status,
            description: property.description,
            price: property.price,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
            location: property.location,
            images: property.imageIds,
            addedBy: userId,
            featured: false,
          },
          draft: false,
          user: contextUser,
          overrideAccess: false,
        })
        console.log(`✓ Created: "${created.title}" (${property.imageIds.length} images)`)
      } catch (error) {
        if (error instanceof Error) {
          console.log(`⊘ Failed: "${property.title}" (${error.message.substring(0, 100)})`)
        } else {
          throw error
        }
      }
    }

    console.log('\n✅ Property seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding property data:', error)
    process.exit(1)
  }
}

seedProperties()
