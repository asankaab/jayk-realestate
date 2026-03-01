import type { CollectionAfterChangeHook } from 'payload'

export const revalidate =
  (tag: string): CollectionAfterChangeHook =>
  async ({ doc, req: { payload } }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/revalidate?secret=${process.env.REVALIDATION_KEY}&tag=${tag}`,
        {
          method: 'POST',
        },
      )

      if (res.ok) {
        payload.logger.info(`Revalidated tag: ${tag}`)
      } else {
        payload.logger.error(`Error revalidating tag: ${tag}`)
      }
    } catch (err) {
      payload.logger.error(`Error hitting revalidate route: ${err}`)
    }

    return doc
  }
