'use client'

import { FC, useState } from 'react'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils'
import { signIn } from 'next-auth/react'
import GoogleIcon from './ui/icons/GithubIcon'
import { useToast } from '@/hooks/use-toast'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      await signIn('github')
    } catch (error) {
      toast({
        title: 'There was a problem',
        description: 'There was an error logging in with Google',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button
        size='sm'
        className='w-full'
        disabled={isLoading}
        isLoading={isLoading}
        onClick={loginWithGoogle}
      >
        {isLoading ? null : <GoogleIcon size='20' styles='mr-2' />}
        Github
      </Button>
    </div>
  )
}

export default UserAuthForm
