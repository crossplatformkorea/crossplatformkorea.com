---
description: Guidelines and best practices for building Convex projects, including database schema design, queries, mutations, and real-world examples
globs: **/convex/**/*.ts,**/convex/**/*.js
---

# Convex Guidelines

## Function Guidelines

### New Function Syntax
- Always use the new Convex function syntax for defining functions:
  ```typescript
  import { query } from "./_generated/server";
  import { v } from "convex/values";
  
  export const f = query({
    args: {},
    returns: v.null(),
    handler: async (ctx, args) => {
      // Function body
    },
  });
  ```

### HTTP Endpoint Syntax
- Define HTTP endpoints in `convex/http.ts` using the `httpAction` decorator
- Endpoints are registered at the exact path specified in the `path` field

### Validators
- Use validators for all arguments and return values
- Use `v.null()` for null returns
- Supported types: `Id`, `Null`, `Int64`, `Float64`, `Boolean`, `String`, `Bytes`, `Array`, `Object`, `Record`

### Function Registration
- Use `internalQuery`, `internalMutation`, `internalAction` for private functions
- Use `query`, `mutation`, `action` for public API functions
- Always include argument and return validators

### Function Calling
- Use `ctx.runQuery`, `ctx.runMutation`, `ctx.runAction` with function references
- Use type annotations for return values when calling functions in the same file
- Minimize calls from actions to queries/mutations to avoid race conditions

### Function References
- Use the `api` object for public functions
- Use the `internal` object for private functions
- Follow file-based routing conventions

### API Design
- Organize public functions thoughtfully using file-based routing
- Keep internal/helper functions private

### Pagination
- Use `paginationOptsValidator` for paginated queries
- Return objects with `page`, `isDone`, and `continueCursor`

## Schema Guidelines
- Define schemas in `convex/schema.ts` using `defineSchema` and `defineTable`
- Name indexes to include all fields (e.g., `by_field1_and_field2`)
- Query index fields in their defined order

## TypeScript Guidelines
- Use `Id<'tableName'>` for table IDs
- Define records with proper key/value types
- Use `as const` for string literals in discriminated unions
- Properly handle promises with `await`, `void`, `.catch()`, or `.then()`

## Authentication Guidelines
- Use `getAuthUserId(ctx)` to check authentication and get user ID
- Never use `ctx.auth.getUserIdentity()` directly
- Return appropriate fallbacks for unauthenticated requests
- Verify authentication before performing protected operations

## Query Guidelines
- Use `withIndex` instead of `filter`
- Use `.unique()` for single document retrieval
- For deletion, collect results and use `ctx.db.delete()`
- Use `.order()` to specify sort order explicitly

## Mutation Guidelines
- Use `ctx.db.replace` for full document replacement
- Use `ctx.db.patch` for partial updates

## Action Guidelines
- Add `"use node";` for Node.js modules
- Never use `ctx.db` inside actions
- Handle promises appropriately

## Scheduling Guidelines
- Use `crons.interval` or `crons.cron` with function references
- Define and export crons from a dedicated file

## File Storage Guidelines
- Use `ctx.storage.getUrl()` for file URLs
- Query the `_storage` system table for metadata
- Convert items to/from `Blob` objects
