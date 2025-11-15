import { createFileRoute, redirect } from '@tanstack/react-router'
import {
  clearUserSession,
  getUSerSession,
} from '@/features/auth/action/session'
import { ProfilePage } from '@/features/member/components/ProfilePage'

export const Route = createFileRoute('/dashboard/member/profile')({
  beforeLoad: async ({ location }) => {
    const res = await getUSerSession()

    if (!res.authenticated || res.user?.role !== 'member') {
      await clearUserSession()
      throw redirect({
        to: '/dashboard',
        search: { redirect: location.href },
      })
    }

    return { session: res.user }
  },
  component: ProfilePage,
})
