import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/employer/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/employer/"!</div>
}
