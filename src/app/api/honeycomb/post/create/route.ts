import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { postValidator } from '@/lib/validators/post'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unathorized', { status: 401 })
    }

    const body = await req.json()

    const { title, content, honeycombId } = postValidator.parse(body)

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        honeycombId,
        userId: session.user.id,
      },
    })

    if (!subscriptionExists) {
      return new Response('Subscribe to honeycomb', {
        status: 400,
      })
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        honeycombId,
      },
    })
    return new Response('OK')
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    } else {
      return new Response('Could not post to honeycomb', { status: 500 })
    }
  }
}
