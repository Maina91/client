import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/features/dashboard/components/Layout'

export const Route = createFileRoute('/dashboard/_layout')({
  component: DashboardLayout,
})
