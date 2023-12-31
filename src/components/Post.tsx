'use client'
import { formatTimeToNow } from '@/lib/utils'
import { Post, User, Vote } from '@prisma/client'
import { FC, useRef } from 'react'
import MessageIcon from './ui/icons/MessageIcon'
import EditorOutput from './EditorOutput'
import PostVoteClient from './post-vote/PostVoteClient'

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
  honeycombName: string
  post: Post & {
    author: User
    votes: Vote[]
  }
  commentAmt: number
  votesAmt: number
  currentVote?: PartialVote
}

const Post: FC<PostProps> = ({
  honeycombName,
  post,
  commentAmt,
  votesAmt,
  currentVote,
}) => {
  const postRef = useRef<HTMLDivElement>(null)

  return (
    <div className='rounded-md bg-white shadow'>
      <div className='px-6 py-4 flex justify-between'>
        <PostVoteClient
          postId={post.id}
          initialVotesAmt={votesAmt}
          initialVote={currentVote?.type}
        />
        <div className='width-0 flex-1'>
          <div className='max-h-40 mt-1 text-xs text-gray-500'>
            {honeycombName ? (
              <>
                <a
                  className='underline tet-zinc-900 text-sm underline-offset-2'
                  href={`r/${honeycombName}`}
                >
                  r/{honeycombName}
                </a>
                <span className='px-1'>-</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.username}</span>{' '}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/r/${honeycombName}/post/${post.id}`}>
            <h4 className='text-lg font-semibold py-2 leading-6 text-gra-900'>
              {post.title}
            </h4>
          </a>
          <div
            className='relative text-sm max-h-40 w-full overflow-clip'
            ref={postRef}
          >
            <EditorOutput content={post.content} />
            {postRef.current?.clientHeight === 160 ? (
              <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent' />
            ) : null}
          </div>
        </div>
      </div>
      <div className='bg-amber-50 z-20 text-sm p-4 sm:px-6'>
        <a
          href={`/r/${honeycombName}/post/${post.id}`}
          className='w-fit flex items-center gap-2'
        >
          <MessageIcon size='16' /> {commentAmt}
        </a>
      </div>
    </div>
  )
}

export default Post
