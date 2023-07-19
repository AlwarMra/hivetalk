'use client'
import { Session } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'
import { FC } from 'react'
import UserAvatar from './UserAvatar'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import ImageIcon from './ui/icons/ImageIcon'
import LinkIcon from './ui/icons/LinkIcon'

interface MiniCreatePostProps {
  session: Session | null
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className='overflow-hidden rounded-md bg-white shadow list-none'>
      <div className='h-full px-6 py-4 flex justify-between gap-6'>
        <div className='relative'>
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />
          <span className='absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-300 outline-2 outline-white' />
        </div>
        <Input
          readOnly
          onClick={() => router.push(pathname + '/submit')}
          placeholder='Create post'
        />
        <Button
          onClick={() => router.push(pathname + '/submit')}
          variant='ghost'
        >
          <ImageIcon size='20' />
        </Button>
        <Button
          onClick={() => router.push(pathname + '/submit')}
          variant='ghost'
        >
          <LinkIcon size='20' />
        </Button>
      </div>
    </div>
  )
}

export default MiniCreatePost
