import { createFileRoute, redirect } from '@tanstack/react-router'
import type { UserType } from '@/features/auth/schema/auth.schema'
import {
  clearUserSession,
  getUSerSession,
} from '@/features/auth/action/session'

export const Route = createFileRoute('/dashboard/')({
  beforeLoad: async ({ location }) => {
    const res = await getUSerSession()

    if (!res.authenticated || !res.user?.role) {
      await clearUserSession()
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    // Redirect user based on user role
    const userRole: UserType = res.user.role

    switch (userRole) {
      case 'MEMBER':
        throw redirect({
          to: '/dashboard/member',
          replace: true,
        })
      case 'EMPLOYER':
        throw redirect({
          to: '/dashboard/employer',
          replace: true,
        })
      default:
        // Handles any unexpected role
        await clearUserSession()
        throw redirect({
          to: '/login',
          search: { redirect: location.href },
        })
    }
  },
  component: () => null,
})
