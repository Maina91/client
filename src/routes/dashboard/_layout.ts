import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/features/dashboard/components/Layout'
import { clearUserSession, getUSerSession } from '@/features/auth/action/auth'


export const Route = createFileRoute('/dashboard/_layout')({
  beforeLoad: async ({ location }) => {
    const res = await getUSerSession();

    if (!res.authenticated || !res.user?.role) {
      await clearUserSession();
      throw redirect({
        to: '/',
        search: { redirect: location.href },
      });
    }

    return { session: res.user };
  },
  component: DashboardLayout,
})
