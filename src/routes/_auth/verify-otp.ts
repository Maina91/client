import { createFileRoute } from '@tanstack/react-router'
import { VerifyOptPage } from '@/features/auth/components/VerifyOtpPage'

export const Route = createFileRoute('/_auth/verify-otp')({
    component: VerifyOptPage,
})
