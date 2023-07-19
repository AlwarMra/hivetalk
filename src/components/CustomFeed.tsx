import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import React from 'react'
import PostFeed from './PostFeed'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'

const CustomFeed = async () => {
  const session = await getAuthSession()

  const followedHoneycombs = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      honeycomb: true,
    },
  })

  const posts = await db.post.findMany({
    where: {
      honeycomb: {
        name: {
          in: followedHoneycombs.map(({ honeycomb }) => honeycomb.id),
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      comments: true,
      author: true,
      honeycomb: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  })

  return <PostFeed initialPosts={posts} />
}

export default CustomFeed
