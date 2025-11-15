import type { EmployeesResponse } from '../types/employees'
import { getSdk } from '@/generated/graphql'
import { getGraphQLClient, handleGraphQLError } from '@/lib/graphql-client'


export async function EmployerEmployeesService(
  token: string,
): Promise<EmployeesResponse> {
  try {
    if (!token) throw new Error('Unauthorized')

    const client = getGraphQLClient(token)
    const sdk = getSdk(client)

    const response = await sdk.Employees()

    return {
      status_code: 200,
      success: true,
      employees: response.employees.map(employee => ({
        member_no: employee.member_no || '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        all_names: employee.all_names || '',
        id_no: employee.id_no || '',
        pin_no: employee.pin_no || '',
      })),
    }
  } catch (error) {
    handleGraphQLError(error)
    throw error
  }
}
