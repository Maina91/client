export interface OtpResponse {
  status: number
  message: string
  token: string
  member_status: number
  accounts_count: number
}

export interface ResendOtpResponse {
  status: number
  message: string
}
