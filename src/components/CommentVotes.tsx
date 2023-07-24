'use client'

import useCustomToast from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { commentVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { CommentVote, VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { FC, useState } from 'react'
import { Button } from './ui/Button'
import ArrowIcon from './ui/icons/ArrowIcon'

interface CommentVotesProps {
  commentId: string
  initialVotesAmt: number
  initialVote?: Pick<CommentVote, 'type'> | null
}

const CommentVotes: FC<CommentVotesProps> = ({
  commentId,
  initialVotesAmt,
  initialVote,
}) => {
  const { loginToast } = useCustomToast()

  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: commentVoteRequest = {
        commentId,
        voteType,
      }

      await axios.patch('/api/honeycomb/post/comment/vote', payload)
    },
    onError: (err, VoteType) => {
      if (VoteType === 'UP') setVotesAmt(prev => prev - 1)
      else setVotesAmt(prev => prev + 1)
      setCurrentVote(prevVote)

      if (err instanceof AxiosError) {
        if (err.response?.status) return loginToast()
      }

      return toast({
        title: 'Something went worng',
        description: 'Your vote was not registered',
        variant: 'destructive',
      })
    },
    onMutate: (type: VoteType) => {
      if (currentVote?.type === type) {
        if (type === 'UP') setVotesAmt(prev => prev - 1)
        else setVotesAmt(prev => prev + 1)
      } else {
        setCurrentVote({ type })
        if (type === 'UP') setVotesAmt(prev => prev + (currentVote ? 2 : 1))
        else setVotesAmt(prev => prev - (currentVote ? 2 : 1))
      }
    },
  })

  return (
    <div className='flex gap-1'>
      <Button
        size='sm'
        variant='ghost'
        aria-label='upvote'
        onClick={() => vote('UP')}
      >
        <ArrowIcon
          size='30'
          styles={
            currentVote?.type === 'UP'
              ? 'fill-emerald-500 text-emerald-500'
              : ''
          }
        />
      </Button>
      <p className='text-center py-2 font-medium text-sm text-zinc-900'>
        {votesAmt}
      </p>
      <Button
        size='sm'
        variant='ghost'
        aria-label='downvote'
        onClick={() => vote('DOWN')}
      >
        <ArrowIcon
          size='30'
          styles={
            'rotate-180 ' +
            (currentVote?.type === 'DOWN' ? 'fill-red-500 text-red-500' : '')
          }
        />
      </Button>
    </div>
  )
}

export default CommentVotes
