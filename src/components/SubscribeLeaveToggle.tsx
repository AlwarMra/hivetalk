'use client'
import { FC, startTransition } from 'react'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { SubscribeToHoneycombPayload } from '@/lib/honeycomb'
import axios, { AxiosError } from 'axios'
import useCustomToast from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean
  honeycombId: string
  honeycombName: string
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  isSubscribed,
  honeycombId,
  honeycombName,
}) => {
  const { loginToast } = useCustomToast()
  const router = useRouter()

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToHoneycombPayload = {
        honeycombId,
      }

      const { data } = await axios.post('/api/honeycomb/subscribe', payload)
      return data as string
    },
    onError: err => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'There was a problem',
        description: 'Something went wrong, please try again',
      })
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })
      return toast({
        title: 'Subscribed!',
        description: `You are now subscribed to r/  ${honeycombName}`,
      })
    },
  })

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToHoneycombPayload = {
        honeycombId,
      }

      const { data } = await axios.post('/api/honeycomb/unsubscribe', payload)
      return data as string
    },
    onError: err => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'There was a problem',
        description: 'Something went wrong, please try again',
      })
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })
      return toast({
        title: 'Subscribed!',
        description: `You are now unsubscribed from r/  ${honeycombName}`,
      })
    },
  })

  return isSubscribed ? (
    <Button
      className='w-full mt-1 mb-4'
      isLoading={isUnsubLoading}
      onClick={() => {
        unsubscribe()
      }}
    >
      Leave community
    </Button>
  ) : (
    <Button
      className='w-full mt-1 mb-4'
      isLoading={isSubLoading}
      onClick={() => {
        subscribe()
      }}
    >
      Join community
    </Button>
  )
}

export default SubscribeLeaveToggle
