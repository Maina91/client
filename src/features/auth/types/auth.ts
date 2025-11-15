import type { LoginUserTypeInput } from "@/generated/graphql"

export interface LoginData {
  username: string
  password: string
  user_type: LoginUserTypeInput
}

// export interface ResetPasswordData {
//   email: string
// }

// export interface UpdatePasswordData {
//   currentPassword: string
//   newPassword: string
// }



