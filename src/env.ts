import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SERVER_URL: z.string().url().optional(),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development')
      .describe('Node environment'),
    API_URL: z
      .string()
      .url()
      .optional()
      .describe('API endpoint URL'),
    SESSION_SECRET: z
      .string()
      .min(32)
      .default('7d9c8a12a9c4e23c6f13c4a761dfbaf0e04cbf621ebc7a44ab7fa23e18c07d58c7e94f8a7c8492dfd6e4f1d3e8b9b6')
      .describe('Secret key for session encryption (min 32 chars)'),
    SESSION_EXPIRY: z
      .coerce
      .number()
      .positive()
      .max(86400) // Max 24 hours
      .default(600)
      .describe('Session expiry time in seconds'),
    SESSION_COOKIE_DOMAIN: z
      .string()
      .regex(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/, 'Must be a valid domain')
      .optional()
      .describe('Domain for cookies (e.g., example.com)'),
  },
  clientPrefix: 'VITE_',
  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
