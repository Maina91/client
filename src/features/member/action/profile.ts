import { createServerFn } from '@tanstack/react-start'
import { MemberProfileService } from '../service/profile'
import { authMiddleware } from '@/middleware/authMiddleware'

export const MemberProfileAction = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      const user = context

      const auth_token = user.authToken

      if (!auth_token) {
        throw new Response('Missing auth token', { status: 401 })
      }

      const profile = await MemberProfileService(auth_token)

      // user session data to be updated later
      const member_no = profile.profile.member_no
      if (member_no) {
        // Note: Session updates might need to be handled differently with middleware
        // For now, keeping similar logic; consider moving to middleware if needed
        const session = await import('@/lib/session').then((m) =>
          m.useAppSession(),
        )
        await session.update({
          user: {
            member_no,
            email: user.user.email,
            role: user.user.role,
          },
        })
      }

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
