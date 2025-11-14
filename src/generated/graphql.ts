export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  DateTime: { input: any; output: any }
  JSON: { input: any; output: any }
}

export type LoginInput = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}

export type LoginResponse = {
  __typename?: 'LoginResponse'
  access_token: Scalars['String']['output']
  refresh_token: Scalars['String']['output']
  user: User
}

export type LogoutResponse = {
  __typename?: 'LogoutResponse'
  success: Scalars['Boolean']['output']
}

export type MemberProfile = {
  __typename?: 'MemberProfile'
  profile: MemberProfileData
  status_code: Scalars['Int']['output']
  message: Scalars['String']['output']
}

export type MemberProfileData = {
  __typename?: 'MemberProfileData'
  member_no: Scalars['String']['output']
  first_name: Scalars['String']['output']
  last_name: Scalars['String']['output']
  email: Scalars['String']['output']
  phone: Scalars['String']['output']
  date_of_birth: Scalars['String']['output']
  address: Scalars['String']['output']
}

export type Mutation = {
  __typename?: 'Mutation'
  login: LoginResponse
  logout: LogoutResponse
  resetPassword: ResetPasswordResponse
  updatePassword: UpdatePasswordResponse
}

export type MutationLoginArgs = {
  input: LoginInput
}

export type MutationResetPasswordArgs = {
  input: ResetPasswordInput
}

export type MutationUpdatePasswordArgs = {
  input: UpdatePasswordInput
}

export type Query = {
  __typename?: 'Query'
  memberProfile: MemberProfile
}

export type ResetPasswordInput = {
  email: Scalars['String']['input']
}

export type ResetPasswordResponse = {
  __typename?: 'ResetPasswordResponse'
  success: Scalars['Boolean']['output']
  message: Scalars['String']['output']
}

export type UpdatePasswordInput = {
  currentPassword: Scalars['String']['input']
  newPassword: Scalars['String']['input']
}

export type UpdatePasswordResponse = {
  __typename?: 'UpdatePasswordResponse'
  success: Scalars['Boolean']['output']
  message: Scalars['String']['output']
}

export type User = {
  __typename?: 'User'
  id: Scalars['ID']['output']
  email: Scalars['String']['output']
  role: Scalars['String']['output']
}

export type LoginMutationVariables = Exact<{
  input: LoginInput
}>

export type LoginMutation = {
  __typename?: 'Mutation'
  login: {
    __typename?: 'LoginResponse'
    access_token: string
    refresh_token: string
    user: { __typename?: 'User'; id: string; email: string; role: string }
  }
}

export type LogoutMutation = {
  __typename?: 'Mutation'
  logout: { __typename?: 'LogoutResponse'; success: boolean }
}

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput
}>

export type ResetPasswordMutation = {
  __typename?: 'Mutation'
  resetPassword: {
    __typename?: 'ResetPasswordResponse'
    success: boolean
    message: string
  }
}

export type UpdatePasswordMutationVariables = Exact<{
  input: UpdatePasswordInput
}>

export type UpdatePasswordMutation = {
  __typename?: 'Mutation'
  updatePassword: {
    __typename?: 'UpdatePasswordResponse'
    success: boolean
    message: string
  }
}

export type GetMemberProfileQuery = {
  __typename?: 'Query'
  memberProfile: {
    __typename?: 'MemberProfile'
    profile: {
      __typename?: 'MemberProfileData'
      member_no: string
      first_name: string
      last_name: string
      email: string
      phone: string
      date_of_birth: string
      address: string
    }
    status_code: number
    message: string
  }
}

export const LoginDocument = `
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    access_token
    refresh_token
    user {
      id
      email
      role
    }
  }
}
    `
export const LogoutDocument = `
    mutation Logout {
  logout {
    success
  }
}
    `
export const ResetPasswordDocument = `
    mutation ResetPassword($input: ResetPasswordInput!) {
  resetPassword(input: $input) {
    success
    message
  }
}
    `
export const UpdatePasswordDocument = `
    mutation UpdatePassword($input: UpdatePasswordInput!) {
  updatePassword(input: $input) {
    success
    message
  }
}
    `
export const GetMemberProfileDocument = `
    query GetMemberProfile {
  memberProfile {
    profile {
      member_no
      first_name
      last_name
      email
      phone
      date_of_birth
      address
    }
    status_code
    message
  }
}
    `

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
) => Promise<T>

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
) => action()

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    Login(
      variables: LoginMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<LoginMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<LoginMutation>(LoginDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'Login',
        'mutation',
      )
    },
    Logout(
      variables?: Exact<{ [key: string]: never }> | undefined,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<LogoutMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<LogoutMutation>(LogoutDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'Logout',
        'mutation',
      )
    },
    ResetPassword(
      variables: ResetPasswordMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<ResetPasswordMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ResetPasswordMutation>(
            ResetPasswordDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'ResetPassword',
        'mutation',
      )
    },
    UpdatePassword(
      variables: UpdatePasswordMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<UpdatePasswordMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdatePasswordMutation>(
            UpdatePasswordDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'UpdatePassword',
        'mutation',
      )
    },
    GetMemberProfile(
      variables?: Exact<{ [key: string]: never }> | undefined,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetMemberProfileQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetMemberProfileQuery>(
            GetMemberProfileDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'GetMemberProfile',
        'query',
      )
    },
  }
}
export type Sdk = ReturnType<typeof getSdk>
