import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'
import { honeycombValidator } from '@/lib/validators/honeycomb'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name } = honeycombValidator.parse(body)

    const honeycombExists = await db.honeycomb.findFirst({
      where: { name },
    })

    if (honeycombExists) {
      return new Response('Honeycomb already exists', { status: 409 })
    }

    const honeycomb = await db.honeycomb.create({
      data: { name, creatorId: session.user.id },
    })

    await db.subscription.create({
      data: {
        userId: session.user.id,
        honeycombId: honeycomb.id,
      },
    })
    return new Response(honeycomb.name)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 })
    } else {
      return new Response('Could not create Honeycomb', { status: 500 })
    }
  } finally {
  }
}
