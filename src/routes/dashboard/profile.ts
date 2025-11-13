import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/features/dashboard/components/Profile'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})
