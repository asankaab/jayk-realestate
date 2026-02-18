import { getPayload, Payload } from 'payload'
import config from '@payload-config'

export const payloadClient: Payload = await getPayload({ config })
