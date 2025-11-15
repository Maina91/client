export interface EmployerProfile {
  company_name: string
  email: string
  pin_no: string
  company_code: string
  logo?: string
}

export interface EmployerProfileResponse {
  status_code: number
  success: boolean
  profile: EmployerProfile
}
