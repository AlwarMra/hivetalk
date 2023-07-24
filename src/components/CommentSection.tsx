import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import CreateComment from './CreateComment'
import PostComment from './PostComment'

interface CommentSectionProps {
  postId: string
}

const CommentSection = async ({ postId }: CommentSectionProps) => {
  const session = await getAuthSession()

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })

  return (
    <div className='flex flex-col gap-y-4 mt-4'>
      <hr className='w-full h-px my-6' />
      <CreateComment postId={postId} />
      <div className='flex flex-col gap-y-6 mt-4'>
        {comments
          .filter(comment => !comment.replyToId)
          .map(topLevelCom => {
            const topLevelComVotesAmt = topLevelCom.votes.reduce(
              (acc, vote) => {
                if (vote.type === 'UP') return acc + 1
                if (vote.type === 'DOWN') return acc - 1
                return acc
              },
              0,
            )
            const topLevelComVote = topLevelCom.votes.find(
              vote => vote.userId === session?.user.id,
            )
            return (
              <div key={topLevelCom.id} className='flex flex-col'>
                <div className='mb-2'>
                  <PostComment
                    postId={postId}
                    comment={topLevelCom}
                    currentVote={topLevelComVote}
                    votesAmt={topLevelComVotesAmt}
                  />
                </div>
                {topLevelCom.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map(reply => {
                    const repliesVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === 'UP') return acc + 1
                      if (vote.type === 'DOWN') return acc - 1
                      return acc
                    }, 0)
                    const replyVote = reply.votes.find(
                      vote => vote.userId === session?.user.id,
                    )

                    return (
                      <div
                        key={reply.id}
                        className='ml-2 py-2 pl-4 border-1-2 border-zinc'
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={repliesVotesAmt}
                          postId={postId}
                        />
                      </div>
                    )
                  })}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default CommentSection
