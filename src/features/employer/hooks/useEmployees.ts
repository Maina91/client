import { useQuery } from '@tanstack/react-query'
import { EmployerEmployeesAction } from '../action/employees'

const EMPLOYER_EMPLOYEES_QUERY_KEY = ['employer', 'employees']

export const useEmployees = () => {
  return useQuery({
    queryKey: EMPLOYER_EMPLOYEES_QUERY_KEY,
    queryFn: async () => {
      try {
        const res = await EmployerEmployeesAction()
        return res.employees
      } catch (err: any) {
        const error = err?.message ?? ''
        console.error(error)
        const error_message = 'Failed to load employees'
        throw new Error(error_message)
      }
    },
  })
}
