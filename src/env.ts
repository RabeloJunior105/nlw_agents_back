import { z } from 'zod'

const envSchema = z.object({
    PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().url().startsWith('postgres://').default('postgres://postgres:postgres@localhost:5433/nlw-agent'),
})

export const env = envSchema.parse(process.env)