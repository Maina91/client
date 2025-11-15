import { createServerFn } from '@tanstack/react-start'
import { EmployerProfileService } from '../service/profile'
import { authMiddleware } from '@/middleware/authMiddleware'
import { csrfMiddleware } from '@/middleware/csrfMiddleware'
import { rateLimitMiddleware } from '@/middleware/rateLimitMiddleware'


export const EmployerProfileAction = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, csrfMiddleware, rateLimitMiddleware])
  .handler(async ({ context }) => {
    try {
      const user = context

      const auth_token = user.authToken

      if (!auth_token) {
        throw new Response('Missing auth token', { status: 401 })
      }

      const profile = await EmployerProfileService(auth_token)

      return {
        success: true,
        profile: profile.profile,
      }
    } catch (err: any) {
      throw {
        message: err?.message ?? 'Unable to fetch profile',
        fieldErrors: err?.fieldErrors ?? null,
      }
    }
  })
