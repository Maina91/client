# TODO: Implement GraphQL Integration with TanStack Query + graphql-request + GraphQL Code Generator (Replace tRPC)

## Overview

Replace tRPC entirely with TanStack Query + graphql-request + GraphQL Code Generator for GraphQL communication to the external Node API at http://localhost:4000/graphql. This modern, lightweight stack provides type-safe GraphQL operations with minimal overhead.

## Steps

### 1. Update Dependencies

- [x] Remove tRPC-related packages from package.json (@trpc/client, @trpc/server, @trpc/tanstack-react-query)
- [x] Remove Apollo Client packages: @apollo/client
- [ ] Add graphql-request, @graphql-codegen/cli, @graphql-codegen/typescript, @graphql-codegen/typescript-operations, @graphql-codegen/typescript-graphql-request
- [ ] Run npm install to update dependencies

### 2. Set Up GraphQL Code Generator

- [ ] Create codegen.yml configuration file
- [ ] Define GraphQL schema URL (http://localhost:4000/graphql)
- [ ] Configure type generation for TypeScript with graphql-request
- [ ] Add npm script for code generation
- [ ] Generate initial types

### 3. Create GraphQL Request Client Setup

- [ ] Create src/lib/graphql-client.ts
  - Configure graphql-request client with base URL
  - Add authentication middleware for auth token injection
  - Include error handling and retry logic
  - Ensure SSR compatibility

### 4. Update Root Provider

- [x] Modify src/integrations/tanstack-query/root-provider.tsx
  - Keep TanStack Query setup
  - Remove Apollo Client provider
  - Ensure GraphQL client is available via context if needed

### 5. Remove tRPC Integration Files

- [x] Delete src/integrations/trpc/ directory and all files (init.ts, react.ts, router.ts)
- [x] Delete src/integrations/apollo/ directory and all files
- [x] Remove tRPC router from src/routes/api.trpc.$.tsx

### 6. Refactor Services to Use GraphQL

- [ ] Update src/features/auth/service/authService.ts: Use graphql-request with generated types
- [ ] Update src/features/member/service/profile.ts: Use graphql-request with generated types
- [ ] Update other service files in features (employer, data, etc.) as needed
- [ ] Define GraphQL queries/mutations in .graphql files for code generation

### 7. Refactor Actions to Use GraphQL

- [ ] Update src/features/auth/action/auth.ts: Use TanStack Query mutations with graphql-request
- [ ] Update src/features/auth/action/session.ts: Adapt for new GraphQL setup
- [ ] Update src/features/member/action/profile.ts: Use TanStack Query with GraphQL
- [ ] Update other action files in features

### 8. Update Hooks and Components

- [ ] Ensure src/features/auth/hooks/useSession.ts works with new setup
- [ ] Update any components using tRPC directly to use TanStack Query with GraphQL
- [ ] Add GraphQL DevTools or similar for development

### 9. Update Root Route and Context

- [x] Modify src/routes/\_\_root.tsx: Update router context to remove tRPC/Apollo
- [x] Ensure GlobalLoader and other components work with new setup

### 10. Testing and Verification

- [ ] Test GraphQL queries/mutations in development
- [ ] Verify authentication flow with local server
- [ ] Check SSR and build process
- [ ] Add error boundaries and loading states as needed

### 11. Cleanup

- [ ] Remove any remaining tRPC/Apollo references in code
- [ ] Update README.md or docs if necessary
- [ ] Ensure linting and formatting pass
