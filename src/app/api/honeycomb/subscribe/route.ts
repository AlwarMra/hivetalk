import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { honeycombSubscriptionValidator } from '@/lib/validators/honeycomb'
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

    if (subscriptionExists) {
      return new Response('You are already subscribed to this community', {
        status: 400,
      })
    }

    await db.subscription.create({
      data: {
        userId: session.user.id,
        honeycombId,
      },
    })
    return new Response(honeycombId)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    } else {
      return new Response('Could not subscribe', { status: 500 })
    }
  }
}
