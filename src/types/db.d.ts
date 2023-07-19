import { Post, Honeycomb, Vote, User, Comment } from '@prisma/client'

export type ExtendedPost = Post & {
  honeycomb: Honeycomb
  votes: Vote[]
  author: User
  comments: Comment[]
}
