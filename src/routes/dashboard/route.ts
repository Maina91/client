import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/features/dashboard/components/Layout'
import {
  clearUserSession,
  getUSerSession,
} from '@/features/auth/action/session'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ location }) => {
    const res = await getUSerSession()

    if (!res.authenticated || !res.user?.role) {
      await clearUserSession()
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    return { session: res.user }
  },
  component: DashboardLayout,
})
