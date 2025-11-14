import { getAppSession } from '@/lib/session'

export async function requireCsrf(request: Request) {
  const session = await getAppSession()
  const data = session.data

  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) return

  const header = request.headers.get('x-csrf-token')
  if (!header || header !== data.csrfToken) {
    throw new Response('CSRF validation failed', { status: 403 })
  }
}
