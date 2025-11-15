import { createServerFn } from '@tanstack/react-start'
import { EmployerEmployeesService } from '../service/employees'
import { authMiddleware } from '@/middleware/authMiddleware'
import { csrfMiddleware } from '@/middleware/csrfMiddleware'
import { rateLimitMiddleware } from '@/middleware/rateLimitMiddleware'

export const EmployerEmployeesAction = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, csrfMiddleware, rateLimitMiddleware])
  .handler(async ({ context }) => {
    try {
      const user = context

      const auth_token = user.authToken

      if (!auth_token) {
        throw new Response('Missing auth token', { status: 401 })
      }

      const employees = await EmployerEmployeesService(auth_token)

      return {
        success: true,
        employees: employees.employees,
      }
    } catch (err: any) {
      throw {
        message: err?.message ?? 'Unable to fetch employees',
        fieldErrors: err?.fieldErrors ?? null,
      }
    }
  })
