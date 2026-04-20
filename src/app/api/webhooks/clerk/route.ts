import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import configPromise from '@payload-config';
import { getPayload } from 'payload';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  const payloadCMS = await getPayload({ config: configPromise });

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;

    const email = email_addresses[0]?.email_address;
    
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
      });
      return new Response('User created in Payload', { status: 201 });
    } catch (error) {
      console.error('Error creating user in Payload:', error);
      return new Response('Error creating user in Payload', { status: 500 });
    }
  }

  if (evt.type === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;

    const email = email_addresses[0]?.email_address;
    
    try {
      const existingUsers = await payloadCMS.find({
        collection: 'users',
        where: { clerkId: { equals: id } },
      });

      if (existingUsers.docs.length > 0) {
        await payloadCMS.update({
          collection: 'users',
          id: existingUsers.docs[0].id,
          data: {
            email: email || '',
            firstName: first_name || existingUsers.docs[0].firstName,
            lastName: last_name || existingUsers.docs[0].lastName,
          },
        });
      }
      return new Response('User updated in Payload', { status: 200 });
    } catch (error) {
      console.error('Error updating user in Payload:', error);
      return new Response('Error updating user in Payload', { status: 500 });
    }
  }

  if (evt.type === 'user.deleted') {
    const { id } = evt.data;
    if (!id) {
        return new Response('No ID provided', { status: 400 });
    }
    
    try {
      const existingUsers = await payloadCMS.find({
        collection: 'users',
        where: { clerkId: { equals: id } },
      });

      if (existingUsers.docs.length > 0) {
        await payloadCMS.delete({
          collection: 'users',
          id: existingUsers.docs[0].id,
        });
      }
      return new Response('User deleted in Payload', { status: 200 });
    } catch (error) {
      console.error('Error deleting user in Payload:', error);
      return new Response('Error deleting user in Payload', { status: 500 });
    }
  }

  return new Response('Webhook received', { status: 200 });
}