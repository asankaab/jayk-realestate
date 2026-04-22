import { WebhookEvent } from '@clerk/nextjs/server'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SIGNIN_SECRET from Clerk Dashboard to .env')
  }

  let evt: WebhookEvent

  try {
    evt = (await verifyWebhook(req)) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  const payloadCMS = await getPayload({ config: configPromise })

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data

    const email = email_addresses[0]?.email_address

    try {
      await payloadCMS.create({
        collection: 'users',
        data: {
          clerkId: id,
          email: email || '',
          firstName: first_name || 'User',
          lastName: last_name || '',
          role: 'user', // Default role
        },
      })
      return new Response('User created in Payload', { status: 201 })
    } catch (error) {
      console.error('Error creating user in Payload:', error)
      return new Response('Error creating user in Payload', { status: 500 })
    }
  }

  if (evt.type === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data

    const email = email_addresses[0]?.email_address

    try {
      const existingUsers = await payloadCMS.find({
        collection: 'users',
        where: { clerkId: { equals: id } },
      })

      if (existingUsers.docs.length > 0) {
        await payloadCMS.update({
          collection: 'users',
          id: existingUsers.docs[0].id,
          data: {
            email: email || '',
            firstName: first_name || existingUsers.docs[0].firstName,
            lastName: last_name || existingUsers.docs[0].lastName,
          },
        })
      }
      return new Response('User updated in Payload', { status: 200 })
    } catch (error) {
      console.error('Error updating user in Payload:', error)
      return new Response('Error updating user in Payload', { status: 500 })
    }
  }

  if (evt.type === 'user.deleted') {
    const { id } = evt.data
    if (!id) {
      return new Response('No ID provided', { status: 400 })
    }

    try {
      const existingUsers = await payloadCMS.find({
        collection: 'users',
        where: { clerkId: { equals: id } },
      })

      if (existingUsers.docs.length > 0) {
        await payloadCMS.delete({
          collection: 'users',
          id: existingUsers.docs[0].id,
        })
      }
      return new Response('User deleted in Payload', { status: 200 })
    } catch (error) {
      console.error('Error deleting user in Payload:', error)
      return new Response('Error deleting user in Payload', { status: 500 })
    }
  }

  return new Response('Webhook received', { status: 200 })
}
