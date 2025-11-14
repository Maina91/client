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
      .default(
        'qt2w7d9c8a12a9c4e23c6f13c4a761dfbaf0e04cbf621ebc7a44ab7fa23e18c07d58c7e94f8a7c8492dfd6e4f1d3e8b9b6',
      )
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
    // Rate limiting configuration
    RATE_LIMIT_ENABLED: z
      .coerce
      .boolean()
      .default(true)
      .describe('Enable rate limiting'),
    RATE_LIMIT_MAX_REQUESTS_PER_MINUTE: z
      .coerce
      .number()
      .positive()
      .default(100)
      .describe('Max requests per minute per user/IP'),
    RATE_LIMIT_WINDOW_MS: z
      .coerce
      .number()
      .positive()
      .default(60000)
      .describe('Rate limit window in milliseconds'),
    RATE_LIMIT_AUTH_MAX_REQUESTS: z
      .coerce
      .number()
      .positive()
      .default(5)
      .describe('Max auth requests per window per IP'),
    RATE_LIMIT_AUTH_WINDOW_MS: z
      .coerce
      .number()
      .positive()
      .default(300000)
      .describe('Auth rate limit window in milliseconds (5 minutes)'),
    RATE_LIMIT_GLOBAL_MAX_REQUESTS: z
      .coerce
      .number()
      .positive()
      .default(1000)
      .describe('Global max requests per window'),
  },
  clientPrefix: 'VITE_',
  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
