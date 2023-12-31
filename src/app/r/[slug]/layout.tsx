import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle'
import ToFeedButton from '@/components/ToFeedButton'
import { buttonVariants } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { format } from 'date-fns'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

const Layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode
  params: { slug: string }
}) => {
  const session = await getAuthSession()

  const honeycomb = await db.honeycomb.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          honeycomb: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      })

  const isSubscribed = !!subscription

  if (!honeycomb) return notFound()

  const memberCount = await db.subscription.count({
    where: {
      honeycomb: {
        name: slug,
      },
    },
  })

  return (
    <div className='sm:container max-w-7xl mx-auto h-full pt-12'>
      <div>
        <ToFeedButton />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
          <div className='flex flex-col col-span-2 space-y-6'>{children}</div>
          <div className='overflow-hidden h-fit rounded-lg border border-amber-200 order-first md:order-last'>
            <div className='px-6 py-4'>
              <div className='font-semibold py-3'>
                About r/ {honeycomb.name}
              </div>
            </div>
            <dl className='divide-y divide-amber-100 px-6 py-4 text-sm leading-6 bg-white'>
              <div className='flex justify-between gap-x-4 py-3'>
                <dt className='text-gray-500'>Created</dt>
                <dd className='text-gray-700'>
                  <time dateTime={honeycomb.createdAt.toDateString()}>
                    {format(honeycomb.createdAt, 'MMMM d, yyy')}{' '}
                  </time>
                </dd>
              </div>
              <div className='flex justify-between gap-x-4 py-3'>
                <dt className='text-gray-500'>Members</dt>
                <dd className='text-gray-700'>
                  <div className='text-gray-900'>{memberCount}</div>
                </dd>
              </div>
              {honeycomb.creatorId === session?.user.id ? (
                <div className='flex justify-between gap-x-4 py-3'>
                  You created this community
                </div>
              ) : null}

              {honeycomb.creatorId !== session?.user.id ? (
                <div>
                  <SubscribeLeaveToggle
                    honeycombId={honeycomb.id}
                    honeycombName={honeycomb.name}
                    isSubscribed={isSubscribed}
                  />
                </div>
              ) : null}
              <Link
                href={`r/${slug}/submit`}
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full mb-6',
                })}
              >
                Create post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
