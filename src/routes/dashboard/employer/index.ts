import { createFileRoute, redirect } from '@tanstack/react-router'
import { clearUserSession, getUSerSession } from '@/features/auth/action/session';
import { IndexPage } from '@/features/employer/components/IndexPage'


export const Route = createFileRoute('/dashboard/employer/')({
  beforeLoad: async ({ location }) => {
    const res = await getUSerSession()

    if (!res.authenticated || res.user?.role !== 'EMPLOYER') {
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


