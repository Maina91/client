import type { LoginResponse, LogoutResponse } from '@/generated/graphql'
import { getSdk } from '@/generated/graphql'
import { getGraphQLClient, handleGraphQLError } from '@/lib/graphql-client'

export interface LoginData {
  email: string
  password: string
}

export interface ResetPasswordData {
  email: string
}

export interface UpdatePasswordData {
  currentPassword: string
  newPassword: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}

export async function loginUserService(
  data: LoginData,
  token?: string | null,
): Promise<LoginResponse> {
  try {
    const client = getGraphQLClient(token)
    const sdk = getSdk(client)

    const response = await sdk.Login({ input: data })

    if (!response.login) {
      throw new Error('Login failed')
    }

    return response.login
  } catch (error) {
    handleGraphQLError(error)
    throw error
  }
}

export async function logoutUserService(
  token: string,
): Promise<LogoutResponse> {
  try {
    const client = getGraphQLClient(token)
    const sdk = getSdk(client)

    const response = await sdk.Logout()

    if (!response.logout) {
      throw new Error('Logout failed')
    }

    return response.logout
  } catch (error) {
    handleGraphQLError(error)
    throw error
  }
}

export async function resetPasswordService(
  data: ResetPasswordData,
  token?: string | null,
): Promise<ResetPasswordResponse> {
  try {
    const client = getGraphQLClient(token)
    const sdk = getSdk(client)

    const response = await sdk.ResetPassword({ input: data })

    if (!response.resetPassword) {
      throw new Error('Reset password failed')
    }

    return response.resetPassword
  } catch (error) {
    handleGraphQLError(error)
    throw error
  }
}

export async function updatePasswordService(
  data: UpdatePasswordData,
  token: string,
): Promise<ResetPasswordResponse> {
  try {
    const client = getGraphQLClient(token)
    const sdk = getSdk(client)

    const response = await sdk.UpdatePassword({ input: data })

    if (!response.updatePassword) {
      throw new Error('Update password failed')
    }

    return response.updatePassword
  } catch (error) {
    handleGraphQLError(error)
    throw error
  }
}
