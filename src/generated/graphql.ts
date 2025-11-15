import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Accounts = {
  __typename?: 'Accounts';
  account_no?: Maybe<Scalars['String']['output']>;
  member_no?: Maybe<Scalars['String']['output']>;
  security_code?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type Contributions = {
  __typename?: 'Contributions';
  account_no?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['String']['output']>;
  employee_amount?: Maybe<Scalars['String']['output']>;
  employee_units?: Maybe<Scalars['String']['output']>;
  employer_amount?: Maybe<Scalars['String']['output']>;
  employer_units?: Maybe<Scalars['String']['output']>;
  member_no?: Maybe<Scalars['String']['output']>;
  mop?: Maybe<Scalars['String']['output']>;
  net_amount?: Maybe<Scalars['String']['output']>;
  securoty_code?: Maybe<Scalars['String']['output']>;
  trans_type?: Maybe<Scalars['String']['output']>;
};

export type Employees = {
  __typename?: 'Employees';
  all_names?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id_no?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  member_no?: Maybe<Scalars['String']['output']>;
  pin_no?: Maybe<Scalars['String']['output']>;
};

export type Login = {
  __typename?: 'Login';
  accessToken: Scalars['String']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export enum LoginUserTypeInput {
  Employer = 'employer',
  Member = 'member'
}

export type MemberProfile = {
  __typename?: 'MemberProfile';
  all_names?: Maybe<Scalars['String']['output']>;
  company_name?: Maybe<Scalars['String']['output']>;
  e_mail?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id_no?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  member_no?: Maybe<Scalars['String']['output']>;
  pin_no?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Login Resource */
  login: Login;
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  user_type: LoginUserTypeInput;
  username: Scalars['String']['input'];
};

export type Profile = {
  __typename?: 'Profile';
  company_code?: Maybe<Scalars['String']['output']>;
  company_name?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  pin_no?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  /** List member accounts */
  accounts: Array<Accounts>;
  /** List member contributions */
  contributions: Array<Contributions>;
  /** List of employees under a company scheme */
  employees: Array<Employees>;
  hello: Scalars['String']['output'];
  /** Member Profile */
  memberProfile: MemberProfile;
  /** Employer Profile */
  profile: Profile;
};


export type QueryContributionsArgs = {
  account_no?: InputMaybe<Scalars['String']['input']>;
  member_no: Scalars['String']['input'];
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
  user_type: LoginUserTypeInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'Login' }
    & Pick<Login, 'accessToken'>
  ) }
);

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = (
  { __typename?: 'Query' }
  & { profile: (
    { __typename?: 'Profile' }
    & Pick<
      Profile,
      | 'company_name'
      | 'email'
      | 'pin_no'
      | 'company_code'
      | 'logo'
    >
  ) }
);


export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!, $user_type: LoginUserTypeInput!) {
  login(username: $username, password: $password, user_type: $user_type) {
    accessToken
  }
}
    `;
export const ProfileDocument = gql`
    query Profile {
  profile {
    company_name
    email
    pin_no
    company_code
    logo
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Login(variables: LoginMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<LoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoginMutation>({ document: LoginDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Login', 'mutation', variables);
    },
    Profile(variables?: ProfileQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfileQuery>({ document: ProfileDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Profile', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;