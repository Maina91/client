import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
}


// const res = await verifySessionAction()
// if (!res.authenticated) {
//   return { redirect: '/' } // or throw redirect
// }
// return null