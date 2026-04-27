import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Properties } from '@/collections/Properties'
import { Blog } from '@/collections/Blog'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    avatar: {
      Component: '@/app/(payload)/admin/components/ClerkAvatar#ClerkAvatar',
    },
    components: {
      graphics: {
        Logo: '@/app/(payload)/admin/components/Logo#Logo',
        Icon: '@/app/(payload)/admin/components/Logo#Logo',
      },
      providers: ['@/app/(payload)/admin/components/ClerkPayloadProvider#ClerkPayloadProvider'],
      beforeLogin: ['@/app/(payload)/admin/components/ClerkLogin#ClerkLogin'],
      logout: {
        Button: '@/app/(payload)/admin/components/LogoutButton#LogoutButton',
      },
    },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Properties, Blog],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      collections: {
        [Media.slug]: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      addRandomSuffix: true,
    }),
  ],
})
