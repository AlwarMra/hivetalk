import Editor from '@/components/Editor'
import { Button } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import React from 'react'

interface pageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: pageProps) => {
  const honeycomb = await db.honeycomb.findFirst({
    where: {
      name: params.slug,
    },
  })

  if (!honeycomb) {
    return notFound()
  }

  return (
    <div className='flex flex-col items-start gap-6'>
      <div className='border border-amber-200 px-2 py-4'>
        <div className='flex flex-wrap items-baseline'>
          <h3 className='text-base font-semibold leading-6 text-gray-900'>
            Create post
          </h3>
          <p className='ml-2 mt-1 truncate text-sm text-gray-500'>
            in r/{params.slug}
          </p>
        </div>
      </div>

      <Editor honeycombId={honeycomb.id} />

      <div className='w-full flex justify-end'>
        <Button type='submit' className='w-full ' form='honeycomb-post-form'>
          Post
        </Button>
      </div>
    </div>
  )
}

export default page
