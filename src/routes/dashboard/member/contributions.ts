import { createFileRoute, redirect } from '@tanstack/react-router'
import { clearUserSession, getUSerSession } from '@/features/auth/action/session';
import { ContributionsPage } from '@/features/member/components/ContributionsPage'


export const Route = createFileRoute('/dashboard/member/contributions')({
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
    component: ContributionsPage,
})


