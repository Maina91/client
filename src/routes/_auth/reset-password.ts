import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordPage } from '@/features/auth/components/ResetPasswordPage'

export const Route = createFileRoute('/_auth/reset-password')({
  component: ResetPasswordPage,
})
