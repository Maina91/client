import { createFileRoute } from '@tanstack/react-router'
import { AccountsPage } from '@/features/member/components/AccountsPage'


export const Route = createFileRoute('/dashboard/member/accounts')({
  component: AccountsPage,
})
