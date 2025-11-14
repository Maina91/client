import { createFileRoute, redirect } from '@tanstack/react-router'
import { VerifyOptPage } from '@/features/auth/components/VerifyOtpPage'
import {
  clearUserSession,
  getUSerSession,
} from '@/features/auth/action/session'

export const Route = createFileRoute('/_auth/verify-otp')({
   beforeLoad: async ({ location }) => {
      const res = await getUSerSession()
  
      if (!res.authenticated) {
        await clearUserSession()
        throw redirect({
          to: '/login',
          search: { redirect: location.href },
        })
      }
  
      return { session: res.user }
    },
  component: VerifyOptPage,
})
