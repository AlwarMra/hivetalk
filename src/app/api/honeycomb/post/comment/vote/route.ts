import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { commentVoteValidator } from '@/lib/validators/vote'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { commentId, voteType } = commentVoteValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    })

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
        })
        return new Response('OK', { status: 200 })
      }
      await db.commentVote.update({
        where: {
          userId_commentId: {
            commentId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      })
      return new Response('Ok', { status: 200 })
    }
    await db.commentVote.create({
      data: {
        type: voteType,
        commentId,
        userId: session.user.id,
      },
    })
    return new Response('Ok', { status: 200 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    } else {
      return new Response('Could not vote', { status: 500 })
    }
  }
}
