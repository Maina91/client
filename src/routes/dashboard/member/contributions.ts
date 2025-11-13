import { createFileRoute } from '@tanstack/react-router'
import { ContributionsPage } from '@/features/member/components/ContributionsPage'


export const Route = createFileRoute('/dashboard/member/contributions')({
    component: ContributionsPage,
})


