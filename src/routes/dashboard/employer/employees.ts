import { createFileRoute } from '@tanstack/react-router'
import { EmployeesPage } from '@/features/employer/components/employees'


export const Route = createFileRoute('/dashboard/employer/employees')({
  component: EmployeesPage,
})

