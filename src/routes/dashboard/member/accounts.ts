import { createFileRoute, redirect } from '@tanstack/react-router'
import {
  clearUserSession,
  getUSerSession,
} from '@/features/auth/action/session'
import { AccountsPage } from '@/features/member/components/AccountsPage'

export const Route = createFileRoute('/dashboard/member/accounts')({
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
  component: AccountsPage,
})
