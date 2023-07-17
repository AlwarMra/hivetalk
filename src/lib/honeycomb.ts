import { z } from 'zod'

export const honeycombValidator = z.object({
  name: z.string().min(3).max(25),
})

export const honeycombSubscriptionValidator = z.object({
  honeycombId: z.string(),
})

export type CreateHoneycombPayload = z.infer<typeof honeycombValidator>
export type SubscribeToHoneycombPayload = z.infer<
  typeof honeycombSubscriptionValidator
>
