import { GraphQLClient } from 'graphql-request'
import { API_URL } from './config/envConfig'

const endpoint = API_URL || 'http://localhost:4000/api'

// Create a function to get a fresh client instance (important for SSR)
export const getGraphQLClient = (token?: string | null) => {
  const client = new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { authorization: `Bearer ${token}` }),
    },
    // Enable automatic retries for network errors
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        // Add timeout
        signal: AbortSignal.timeout(30000), // 30 second timeout
      })
    },
  })

  return client
}

// Global client instance for non-SSR contexts
export const graphqlClient = getGraphQLClient()

// Function to update auth token on the global client
export const setAuthToken = (token: string | null) => {
  if (token) {
    graphqlClient.setHeader('authorization', `Bearer ${token}`)
  } else {
    graphqlClient.setHeaders({
      'Content-Type': 'application/json',
    })
  }
}

// Error handling utility
export const handleGraphQLError = (error: any) => {
  if (error.response?.errors?.[0]) {
    const graphQLError = error.response.errors[0]
    throw new Error(graphQLError.message || 'GraphQL Error')
  }

  if (error.response?.status === 401) {
    throw new Error('Unauthorized - please log in again')
  }

  if (error.response?.status >= 500) {
    throw new Error('Server error - please try again later')
  }

  throw new Error(error.message || 'Network error')
}
