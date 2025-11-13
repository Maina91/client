import { createFileRoute, redirect } from '@tanstack/react-router'
import { clearUserSession, getUSerSession } from '@/features/auth/action/auth'
import { ProfilePage } from '@/features/dashboard/components/Profile'


export const Route = createFileRoute('/dashboard/profile')({
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
  component: ProfilePage,
})
