import { createFileRoute, redirect } from '@tanstack/react-router'
import {
  clearUserSession,
  getUSerSession,
} from '@/features/auth/action/session'
import { IndexPage } from '@/features/member/components/IndexPage'

export const Route = createFileRoute('/dashboard/member/')({
  beforeLoad: async ({ location }) => {
    const res = await getUSerSession()

    if (!res.authenticated || res.user?.role !== 'MEMBER') {
      await clearUserSession()
      throw redirect({
        to: '/dashboard',
        search: { redirect: location.href },
      })
    }

    return { session: res.user }
  },
  component: IndexPage,
})
