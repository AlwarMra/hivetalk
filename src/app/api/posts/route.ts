import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const session = await getAuthSession()

  let followedCommunitiesIds: string[] = []

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        honeycomb: true,
      },
    })

    followedCommunitiesIds = followedCommunities.map(com => com.honeycomb.id)
  }

  try {
    const { limit, page, honeycombName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        honeycombName: z.string().nullish().optional(),
      })
      .parse({
        honeycombName: url.searchParams.get('honeycombName'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
      })

    let whereClause = {}

    if (honeycombName) {
      whereClause = {
        honeycomb: {
          name: honeycombName,
        },
      }
    } else if (session) {
      whereClause = {
        honeycomb: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      }
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        honeycomb: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    })
    return new Response(JSON.stringify(posts))
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 })
    }
    return new Response('Could not fetch posts', { status: 500 })
  }
}
