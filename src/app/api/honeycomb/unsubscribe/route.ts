import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { honeycombSubscriptionValidator } from '@/lib/honeycomb'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unathorized', { status: 401 })
    }

    const body = await req.json()

    const { honeycombId } = honeycombSubscriptionValidator.parse(body)

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        honeycombId,
        userId: session.user.id,
      },
    })

    if (!subscriptionExists) {
      return new Response('You are not subscribed to this community', {
        status: 400,
      })
    }

    const honeycomb = await db.honeycomb.findFirst({
      where: {
        id: honeycombId,
        creatorId: session.user.id,
      },
    })

    if (honeycomb) {
      return new Response("You can't unsubscribe from your own honeycomb", {
        status: 400,
      })
    }

    await db.subscription.delete({
      where: {
        userId_honeycombId: {
          userId: session.user.id,
          honeycombId,
        },
      },
    })
    return new Response(honeycombId)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    } else {
      return new Response('Could not unsubscribe', { status: 500 })
    }
  }
}
