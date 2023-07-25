'use client'

import { UsernameRequest, UsernameValidator } from '@/lib/validators/username'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from './ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/Card'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface UsernameFormProps {
  user: Pick<User, 'id' | 'username'>
}

const UsernameForm: FC<UsernameFormProps> = ({ user }) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user.username || '',
    },
  })

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: UsernameRequest) => {
      const payload: UsernameRequest = { name }
      const data = await axios.patch(`/api/username`, payload)
      return data
    },
    onError: err => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: 'Username already taken',
            description: 'Please enter a different username',
            variant: 'destructive',
          })
        }
      }
      toast({
        title: 'An error occurred',
        description: 'Could not change username',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        description: 'Username updated',
      })
      router.refresh()
    },
  })

  return (
    <form
      onSubmit={handleSubmit(e => {
        updateUsername(e)
      })}
    >
      <Card className='border-amber-300'>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>Please enter a new username</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='relative grid gap-1'>
            <div className='absolute top-0 left-0 w-8 h-10 grid place-items-center'>
              <span className='text-sm text-zinc-400'>u/</span>
            </div>
          </div>
          <Label className='sr-only' htmlFor='name'>
            Name
          </Label>
          <Input
            id='name'
            className='w-[400px] pl-6'
            size={32}
            {...register('name')}
          />
          {errors.name && (
            <p className='px-1 text-xs text-red-500'>{errors.name.message}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button isLoading={isLoading}>Change name</Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default UsernameForm
