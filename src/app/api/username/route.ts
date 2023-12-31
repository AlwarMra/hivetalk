import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { UsernameValidator } from '@/lib/validators/username'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response('Unathorized', { status: 401 })
    }
    const body = await req.json()
    const { name } = UsernameValidator.parse(body)

    const username = await db.user.findFirst({
      where: {
        username: name,
      },
    })

    if (username) {
      return new Response('Username is alredy taken', { status: 408 })
    }

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
      },
    })

    return new Response('Ok', { status: 200 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 })
    }
    return new Response('Could not update username', { status: 500 })
  }
}
