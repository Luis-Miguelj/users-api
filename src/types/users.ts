import { z } from 'zod'

export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export type userProps = z.infer<typeof userSchema>

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type loginProps = z.infer<typeof loginSchema>
