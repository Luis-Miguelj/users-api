import { z } from 'zod'

const envSchema = z.object({
  JWT_SECRET: z.string(),
  DIRECT_URL: z.string(),
  DATABASE_URL: z.string(),
  COOKIE_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
