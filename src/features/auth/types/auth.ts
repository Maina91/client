import type { UserType } from '../schema/auth.schema'

export interface LoginData {
  username: string
  password: string
  user_type: UserType
}

// export interface ResetPasswordData {
//   email: string
// }

// export interface UpdatePasswordData {
//   currentPassword: string
//   newPassword: string
// }



