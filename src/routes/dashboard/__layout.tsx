import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout'

export const Route = createFileRoute('/dashboard/__layout')({
  component: DashboardComponent,
})

function DashboardComponent() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
