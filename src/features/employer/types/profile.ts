export interface EmployerProfile {
  member_no: string
  full_name: string
  first_name: string
  last_name: string
  email_address: string
  mobile_no: string
  user_type: 'MEMBER' | 'EMPLOYER'
  profileProgress?: any
  customer_ref?: string
  [key: string]: any
}

export interface EmployerProfileResponse {
  status_code: number
  success: boolean
  profile: EmployerProfile
}
