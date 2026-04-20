import { getPayload } from 'payload'
import config from './src/payload.config'

async function checkMedia() {
  const payload = await getPayload({ config })
  const media = await payload.find({ collection: 'media', limit: 50 })
  console.log('Media IDs:', media.docs.map(m => m.id))
  process.exit(0)
}
checkMedia()
