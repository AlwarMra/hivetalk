'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/Button'
import XIcon from './ui/icons/XIcon'

const CloseModal = () => {
  const router = useRouter()

  return (
    <Button
      variant='subtle'
      className='h-6 w-6 p-0 rounded-md'
      aria-label='close modal'
      onClick={() => router.back()}
    >
      <XIcon size={'16'} />
    </Button>
  )
}

export default CloseModal
