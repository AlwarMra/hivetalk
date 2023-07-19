import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { postVoteValidator } from '@/lib/validators/vote'
import { CachedPost } from '@/types/redis'
import { Post, User, Vote, VoteType } from '@prisma/client'
import { z } from 'zod'

const CACHER_AFTER_UPVOTES = 10
export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { postId, voteType } = postVoteValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    })

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    })

    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        })
        return new Response('OK', { status: 200 })
      }
      await db.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      })
      cachedRecountedVotes({ post, voteType, postId })
      return new Response('Ok', { status: 200 })
    }
    await db.vote.create({
      data: {
        type: voteType,
        postId,
        userId: session.user.id,
      },
    })
    cachedRecountedVotes({ post, voteType, postId })
    return new Response('Ok', { status: 200 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    } else {
      return new Response('Could not vote', { status: 500 })
    }
  }
}

async function cachedRecountedVotes({
  post,
  voteType,
  postId,
}: {
  post: Post & {
    author: User
    votes: Vote[]
  }
  voteType: VoteType
  postId: string
}) {
  //Recount votes
  const votesAmt = post.votes.reduce((acc: number, vote: Vote) => {
    if (vote.type === 'DOWN') return acc + 1
    if (vote.type === 'UP') return acc - 1
    return acc
  }, 0)

  if (votesAmt >= CACHER_AFTER_UPVOTES) {
    const cachePayload: CachedPost = {
      id: post.id,
      title: post.title,
      authorUsername: post.author.name ?? '',
      content: JSON.stringify(post.content),
      createdAt: post.createdAt,
      currentVote: voteType,
    }
    await redis.hset(`post:${postId}`, cachePayload)
  }
}
