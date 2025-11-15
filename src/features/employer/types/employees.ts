export interface Employee {
  member_no: string
  first_name: string
  last_name: string
  all_names: string
  id_no: string
  pin_no: string
}


export interface EmployeesResponse {
    status_code: number
    success: boolean
    employees: Array<Employee>
}
