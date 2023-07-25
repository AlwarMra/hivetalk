'use client'

import { usePathname } from 'next/navigation'
import { buttonVariants } from './ui/Button'
import ChevronIcon from './ui/icons/ChevronIcon'

const ToFeedButton = () => {
  const pathname = usePathname()

  // if path is /r/mycom, turn into /
  // if path is /r/mycom/post/cligad6jf0003uhest4qqkeco, turn into /r/mycom

  const subredditPath = getHoneycombPath(pathname)

  return (
    <a href={subredditPath} className={buttonVariants({ variant: 'ghost' })}>
      <ChevronIcon styles='mr-1 w-4 h-4' />
      {subredditPath === '/' ? 'Back home' : 'Back to honeycomb'}
    </a>
  )
}

const getHoneycombPath = (pathname: string) => {
  const splitPath = pathname.split('/')

  if (splitPath.length === 3) return '/'
  else if (splitPath.length > 3) return `/${splitPath[1]}/${splitPath[2]}`
  // default path, in case pathname does not match expected format
  else return '/'
}

export default ToFeedButton
