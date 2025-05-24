**Copilot Instructions for Convex Projects**

**Objective**: Provide guidelines and best practices for building Convex projects, including database schema design, queries, mutations, and real-world examples. These instructions are intended to guide the generation of TypeScript/JavaScript code for Convex applications.

**File Scope**:

- Applies to files matching the patterns: `**/*.ts`, `**/*.tsx`, `**/*.js`, `**/*.jsx`

---

### **Convex Function Guidelines**

#### **New Function Syntax**

- Always use the new Convex function syntax for defining functions.
- Example for a query function:

  ```typescript
  import { query } from './_generated/server';
  import { v } from 'convex/values';

  export const f = query({
    args: {},
    returns: v.null(),
    handler: async (ctx, args) => {
      // Function body
    },
  });
  ```

#### **HTTP Endpoint Syntax**

- Define HTTP endpoints in `convex/http.ts` using the `httpAction` decorator.
- Example:

  ```typescript
  import { httpRouter } from 'convex/server';
  import { httpAction } from './_generated/server';

  const http = httpRouter();
  http.route({
    path: '/echo',
    method: 'POST',
    handler: httpAction(async (ctx, req) => {
      const body = await req.bytes();
      return new Response(body, { status: 200 });
    }),
  });
  ```

- HTTP endpoints are registered at the exact path specified in the `path` field (e.g., `/api/someRoute`).

#### **Validators**

- Use validators for arguments and schemas. Examples:

  - Array validator:

    ```typescript
    import { mutation } from './_generated/server';
    import { v } from 'convex/values';

    export default mutation({
      args: { simpleArray: v.array(v.union(v.string(), v.number())) },
      handler: async (ctx, args) => {
        // Logic here
      },
    });
    ```

  - Discriminated union schema:

    ```typescript
    import { defineSchema, defineTable } from 'convex/server';
    import { v } from 'convex/values';

    export default defineSchema({
      results: defineTable(
        v.union(
          v.object({ kind: v.literal('error'), errorMessage: v.string() }),
          v.object({ kind: v.literal('success'), value: v.number() }),
        ),
      ),
    });
    ```

  - Use `v.null()` for null returns:

    ```typescript
    import { query } from './_generated/server';
    import { v } from 'convex/values';

    export const exampleQuery = query({
      args: {},
      returns: v.null(),
      handler: async (ctx, args) => {
        console.log('This query returns a null value');
        return null;
      },
    });
    ```

- Supported Convex types and validators:
  - `Id`: `v.id(tableName)` (e.g., `doc._id`)
  - `Null`: `v.null()` (Use `null`, not `undefined`)
  - `Int64`: `v.int64()` (e.g., `3n`, supports BigInts between -2^63 and 2^63-1)
  - `Float64`: `v.number()` (e.g., `3.1`, supports IEEE-754 doubles)
  - `Boolean`: `v.boolean()` (e.g., `true`)
  - `String`: `v.string()` (e.g., `"abc"`, UTF-8, <1MB)
  - `Bytes`: `v.bytes()` (e.g., `ArrayBuffer`, <1MB)
  - `Array`: `v.array(values)` (e.g., `[1, 3.2, "abc"]`, max 8192 elements)
  - `Object`: `v.object({property: value})` (e.g., `{a: "abc"}`, max 1024 entries, plain JS objects only)
  - `Record`: `v.record(keys, values)` (e.g., `{"a": "1", "b": "2"}`, ASCII keys, no "$" or "\_" prefix)

#### **Function Registration**

- Use `internalQuery`, `internalMutation`, `internalAction` for private functions (import from `./_generated/server`).
- Use `query`, `mutation`, `action` for public API functions exposed to the internet.
- Never register functions via `api` or `internal` objects.
- Always include argument and return validators for all functions (`query`, `mutation`, `action`, `internalQuery`, `internalMutation`, `internalAction`).
- Use `returns: v.null()` if a function doesn't return a value (implicitly returns `null`).

#### **Function Calling**

- Use `ctx.runQuery` to call a query from a query, mutation, or action.
- Use `ctx.runMutation` to call a mutation from a mutation or action.
- Use `ctx.runAction` to call an action from another action (only for cross-runtime needs, e.g., V8 to Node; otherwise, use a helper function).
- Minimize calls from actions to queries/mutations to avoid race conditions.
- Always pass a `FunctionReference` to `ctx.runQuery`, `ctx.runMutation`, or `ctx.runAction` (not the function itself).
- Add type annotations for return values when calling functions in the same file:

  ```typescript
  export const f = query({
    args: { name: v.string() },
    returns: v.string(),
    handler: async (ctx, args) => 'Hello ' + args.name,
  });

  export const g = query({
    args: {},
    returns: v.null(),
    handler: async (ctx, args) => {
      const result: string = await ctx.runQuery(api.example.f, { name: 'Bob' });
      return null;
    },
  });
  ```

#### **Function References**

- Use the `api` object (from `convex/_generated/api.ts`) to call public functions (`query`, `mutation`, `action`).
- Use the `internal` object (from `convex/_generated/api.ts`) to call private functions (`internalQuery`, `internalMutation`, `internalAction`).
- File-based routing applies:
  - Public function `f` in `convex/example.ts`: `api.example.f`
  - Private function `g` in `convex/example.ts`: `internal.example.g`
  - Public function `h` in `convex/messages/access.ts`: `api.messages.access.h`

#### **API Design**

- Organize public functions (`query`, `mutation`, `action`) thoughtfully in the `convex/` directory using file-based routing.
- Use `internalQuery`, `internalMutation`, `internalAction` for private functions.

#### **Pagination**

- Use pagination for queries returning incremental results:

  ```typescript
  import { v } from 'convex/values';
  import { query } from './_generated/server';
  import { paginationOptsValidator } from 'convex/server';

  export const listWithExtraArg = query({
    args: { paginationOpts: paginationOptsValidator, author: v.string() },
    handler: async (ctx, args) => {
      return await ctx.db
        .query('messages')
        .filter((q) => q.eq(q.field('author'), args.author))
        .order('desc')
        .paginate(args.paginationOpts);
    },
  });
  ```

- `paginationOpts` includes:
  - `numItems`: `v.number()` (max documents to return)
  - `cursor`: `v.union(v.string(), v.null())` (cursor for the next page)
- `.paginate()` returns:
  - `page`: Array of documents
  - `isDone`: Boolean (last page indicator)
  - `continueCursor`: String (cursor for the next page)

---

### **Validator Guidelines**

- Use `v.int64()` for signed 64-bit integers (do not use deprecated `v.bigint()`).
- Use `v.record()` for record types (do not use `v.map()` or `v.set()`).

---

### **Schema Guidelines**

- Define schemas in `convex/schema.ts` using `defineSchema` and `defineTable` from `convex/server`.
- System fields (`_creationTime`: `v.number()`, `_id`: `v.id(tableName)`) are automatically added.
- Name indexes to include all fields (e.g., `["field1", "field2"]` → `by_field1_and_field2`).
- Query index fields in their defined order; create separate indexes for different query orders.

---

### **TypeScript Guidelines**

- Use `Id` type from `./_generated/dataModel` for table IDs (e.g., `Id<'users'>`).
- Define `Record` types with proper key/value types:

  ```typescript
  import { query } from './_generated/server';
  import { Doc, Id } from './_generated/dataModel';

  export const exampleQuery = query({
    args: { userIds: v.array(v.id('users')) },
    returns: v.record(v.id('users'), v.string()),
    handler: async (ctx, args) => {
      const idToUsername: Record<Id<'users'>, string> = {};
      for (const userId of args.userIds) {
        const user = await ctx.db.get(userId);
        if (user) idToUsername[user._id] = user.username;
      }
      return idToUsername;
    },
  });
  ```

- Be strict with ID types (e.g., use `Id<'users'>`, not `string`).
- Use `as const` for string literals in discriminated unions.
- Define arrays as `const array: Array<T> = [...];`.
- Define records as `const record: Record<KeyType, ValueType> = {...};`.
- Add `@types/node` to `package.json` when using Node.js built-in modules.

#### **Promise Handling**

- Properly handle promises to avoid "floating promises" errors (`@typescript-eslint/no-floating-promises`):

  - Always await promises when inside async functions:
    ```typescript
    async function example() {
      await myPromiseFunction(); // Good: Promise is awaited
    }
    ```
  - Use the `void` operator to explicitly mark ignored promises:

    ```typescript
    // When you intentionally don't want to wait for the promise
    void myPromiseFunction(); // Good: Promise is explicitly ignored

    // Common in event handlers that call async functions
    const handleClick = () => {
      void submitData();
    };

    // With mapping functions where you don't need the result
    items.map((item) => void processItem(item));
    ```

  - Use `.catch()` to handle potential errors:
    ```typescript
    myPromiseFunction().catch((error) => {
      console.error('Operation failed:', error);
    });
    ```
  - Use `.then()` with both success and error handlers:
    ```typescript
    myPromiseFunction().then(
      (result) => console.log('Success:', result),
      (error) => console.error('Error:', error),
    );
    ```

- When using the `void` operator with promises, place it at the beginning of the expression:

  ```typescript
  // Correct
  void someAsyncFunction();

  // Incorrect
  someAsyncFunction(); // Floating promise!
  ```

- For event handlers in React that call async functions:
  ```typescript
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void onSubmitForm(); // Mark async function call with void
  };
  ```

---

### **Authentication Guidelines**

- Always use `getAuthUserId(ctx)` to check if a user is authenticated and get their ID:

  ```typescript
  import { getAuthUserId } from '@convex-dev/auth/server';

  export const myAuthenticatedFunction = query({
    args: {},
    returns: v.boolean(),
    handler: async (ctx, args) => {
      // Get the user ID or null if not authenticated
      const userId = await getAuthUserId(ctx);

      if (!userId) {
        // Handle unauthenticated case
        return false;
      }

      // User is authenticated, proceed with the function
      return true;
    },
  });
  ```

- Never use `ctx.auth.getUserIdentity()` to get userId - this makes debugging difficult and is error-prone.
- Return appropriate error messages or empty results when a user is not authenticated.
- For mutations and actions that require authentication, verify the user is authenticated before performing operations:

  ```typescript
  export const protectedMutation = mutation({
    args: {
      /* args */
    },
    handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) {
        throw new Error('Authentication required');
      }

      // Continue with authenticated operation
    },
  });
  ```

---

### **Full-Text Search Guidelines**

- Example query for full-text search (e.g., 10 messages in channel `#general` matching `"hello hi"`):
  ```typescript
  const messages = await ctx.db
    .query('messages')
    .withSearchIndex('search_body', (q) => q.search('body', 'hello hi').eq('channel', '#general'))
    .take(10);
  ```

---

### **Query Guidelines**

- Avoid `filter` in queries; use `withIndex` with a defined schema index instead.
- Do not use `.delete()` on queries; collect results and use `ctx.db.delete(row._id)`:
  ```typescript
  const rows = await ctx.db.query('table').collect();
  for (const row of rows) await ctx.db.delete(row._id);
  ```
- Use `.unique()` to retrieve a single document (throws if multiple documents match).
- For async iteration, use `for await (const row of query)` instead of `.collect()` or `.take(n)`.
- Default order is ascending `_creationTime`; use `.order("asc")` or `.order("desc")` to override.
- Queries with indexes order by index columns for efficiency.

---

### **Mutation Guidelines**

- Use `ctx.db.replace` to fully replace a document (throws if document doesn't exist).
- Use `ctx.db.patch` to shallow merge updates (throws if document doesn't exist).

---

### **Action Guidelines**

- Add `"use node";` at the top of action files using Node.js modules.
- Do not use `ctx.db` in actions (no database access).
- Example action:

  ```typescript
  import { action } from './_generated/server';
  import { v } from 'convex/values';

  export const exampleAction = action({
    args: {},
    returns: v.null(),
    handler: async (ctx, args) => {
      console.log('This action does not return anything');
      return null;
    },
  });
  ```

---

### **Scheduling Guidelines (Cron Jobs)**

- Use `crons.interval` or `crons.cron` for scheduling (do not use `crons.hourly`, `crons.daily`, `crons.weekly`).
- Pass a `FunctionReference` to cron methods (not the function itself).
- Define and export crons in a `crons.ts` file:

  ```typescript
  import { cronJobs } from 'convex/server';
  import { internal } from './_generated/api';
  import { internalAction } from './_generated/server';

  const empty = internalAction({
    args: {},
    returns: v.null(),
    handler: async (ctx, args) => {
      console.log('empty');
    },
  });

  const crons = cronJobs();
  crons.interval('delete inactive users', { hours: 2 }, internal.crons.empty, {});
  export default crons;
  ```

- Import the `internal` object for internal functions, even if defined in the same file.

---

### **File Storage Guidelines**

- Use `ctx.storage.getUrl()` to get a signed URL for a file (returns `null` if the file doesn't exist).
- Do not use deprecated `ctx.storage.getMetadata`; query the `_storage` system table instead:

  ```typescript
  import { query } from './_generated/server';
  import { Id } from './_generated/dataModel';

  type FileMetadata = {
    _id: Id<'_storage'>;
    _creationTime: number;
    contentType?: string;
    sha256: string;
    size: number;
  };

  export const exampleQuery = query({
    args: { fileId: v.id('_storage') },
    returns: v.null(),
    handler: async (ctx, args) => {
      const metadata: FileMetadata | null = await ctx.db.system.get(args.fileId);
      console.log(metadata);
      return null;
    },
  });
  ```

- Convert items to/from `Blob` objects for Convex storage.

---

### **Example: Chat App Backend**

**Task**: Create a real-time chat application backend with AI responses. The app should:

- Allow user creation with names.
- Support multiple chat channels.
- Enable users to send messages to channels.
- Automatically generate AI responses using OpenAI's GPT-4.
- Show the 10 most recent messages per channel.

**Requirements**:

- Database tables: `users`, `channels`, `messages`.
- Public APIs for user/channel management, message operations, and AI response generation.
- Store messages with channel, author, and content, maintaining order.
- Limit history to 10 recent messages per channel.

**Implementation**:

#### **`package.json`**

```json
{
  "name": "chat-app",
  "description": "This example shows how to build a chat app without authentication.",
  "version": "1.0.0",
  "dependencies": {
    "convex": "^1.17.4",
    "openai": "^4.79.0"
  },
  "devDependencies": {
    "typescript": "^5.7.3"
  }
}
```

#### **`tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "exclude": ["convex"],
  "include": ["**/src/**/*.tsx", "**/src/**/*.ts", "vite.config.ts"]
}
```

#### **`convex/schema.ts`**

```typescript
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  channels: defineTable({ name: v.string() }),
  users: defineTable({ name: v.string() }),
  messages: defineTable({
    channelId: v.id('channels'),
    authorId: v.optional(v.id('users')),
    content: v.string(),
  }).index('by_channel', ['channelId']),
});
```

#### **`convex/index.ts`**

```typescript
import {
  query,
  mutation,
  internalQuery,
  internalMutation,
  internalAction,
} from './_generated/server';
import { v } from 'convex/values';
import OpenAI from 'openai';
import { internal } from './_generated/api';

// Create a user
export const createUser = mutation({
  args: { name: v.string() },
  returns: v.id('users'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('users', { name: args.name });
  },
});

// Create a channel
export const createChannel = mutation({
  args: { name: v.string() },
  returns: v.id('channels'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('channels', { name: args.name });
  },
});

// List recent messages
export const listMessages = query({
  args: { channelId: v.id('channels') },
  returns: v.array(
    v.object({
      _id: v.id('messages'),
      _creationTime: v.number(),
      channelId: v.id('channels'),
      authorId: v.optional(v.id('users')),
      content: v.string(),
    }),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_channel', (q) => q.eq('channelId', args.channelId))
      .order('desc')
      .take(10);
  },
});

// Send a message and schedule AI response
export const sendMessage = mutation({
  args: {
    channelId: v.id('channels'),
    authorId: v.id('users'),
    content: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const channel = await ctx.db.get(args.channelId);
    if (!channel) throw new Error('Channel not found');
    const user = await ctx.db.get(args.authorId);
    if (!user) throw new Error('User not found');
    await ctx.db.insert('messages', {
      channelId: args.channelId,
      authorId: args.authorId,
      content: args.content,
    });
    await ctx.scheduler.runAfter(0, internal.index.generateResponse, {
      channelId: args.channelId,
    });
    return null;
  },
});

const openai = new OpenAI();

// Generate AI response
export const generateResponse = internalAction({
  args: { channelId: v.id('channels') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.index.loadContext, {
      channelId: args.channelId,
    });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: context,
    });
    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content in response');
    await ctx.runMutation(internal.index.writeAgentResponse, {
      channelId: args.channelId,
      content,
    });
    return null;
  },
});

// Load conversation context
export const loadContext = internalQuery({
  args: { channelId: v.id('channels') },
  returns: v.array(
    v.object({
      role: v.union(v.literal('user'), v.literal('assistant')),
      content: v.string(),
    }),
  ),
  handler: async (ctx, args) => {
    const channel = await ctx.db.get(args.channelId);
    if (!channel) throw new Error('Channel not found');
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_channel', (q) => q.eq('channelId', args.channelId))
      .order('desc')
      .take(10);
    const result = [];
    for (const message of messages) {
      if (message.authorId) {
        const user = await ctx.db.get(message.authorId);
        if (!user) throw new Error('User not found');
        result.push({
          role: 'user' as const,
          content: `${user.name}: ${message.content}`,
        });
      } else {
        result.push({ role: 'assistant' as const, content: message.content });
      }
    }
    return result;
  },
});

// Write AI response
export const writeAgentResponse = internalMutation({
  args: { channelId: v.id('channels'), content: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert('messages', {
      channelId: args.channelId,
      content: args.content,
    });
    return null;
  },
});
```

**Copilot Instructions for React Projects**

**Objective**: Provide guidelines and best practices for building React applications, focusing on internationalization (i18n) implementation and other React-specific patterns.

**File Scope**:

- Applies to files matching the patterns: `**/*.ts`, `**/*.tsx`, `**/*.jsx`

---

### **Internationalization (i18n) with i18next**

#### **File Structure**

- Store translation files in the `src/locales/` directory with language-specific JSON files (e.g., `en.json`, `ko.json`, `ja.json`).
- Organize translations in a hierarchical structure using nested objects for logical grouping by feature or component.

  ```json
  {
    "common": {
      "buttons": {
        "submit": "Submit",
        "cancel": "Cancel"
      }
    },
    "auth": {
      "signIn": {
        "title": "Sign In",
        "emailLabel": "Email Address"
      }
    }
  }
  ```

#### **Configuration**

- Use the `i18n.ts` utility file for configuration and initialization:

  ```typescript
  // src/lib/i18n.ts
  import i18n from 'i18next';
  import { initReactI18next } from 'react-i18next';

  // Import language resources
  import en from '../locales/en.json';
  import ko from '../locales/ko.json';
  import ja from '../locales/ja.json';

  // Initialize i18next
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
      ja: { translation: ja },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

  // Utility function to get current locale
  export const getLocale = (): string => {
    return i18n.language || 'en';
  };

  // Export the translation function
  export const t = i18n.t.bind(i18n);

  export default i18n;
  ```

---

### **Translation Guidelines**

#### **Using Translations**

- Import the `t` function from `lib/i18n.ts` to access translations:

  ```tsx
  import { t } from '../lib/i18n';

  function MyComponent() {
    return (
      <div>
        <h1>{t('auth.signIn.title')}</h1>
        <label>{t('auth.signIn.emailLabel')}</label>
      </div>
    );
  }
  ```

- For dynamic values, use interpolation with the `{{variable}}` syntax:

  ```tsx
  // In translation file:
  // "welcome": "Welcome, {{name}}!"

  <p>{t('welcome', { name: username })}</p>
  ```

#### **Pluralization**

- Use i18next pluralization features for count-based text:

  ```json
  // In translation file:
  {
    "items": {
      "one": "{{count}} item",
      "other": "{{count}} items"
    }
  }
  ```

  ```tsx
  <p>{t('items', { count: itemCount })}</p>
  ```

#### **Language Switching**

- Implement language switching with the `i18n.changeLanguage` function:

  ```tsx
  import i18n from '../lib/i18n';

  function LanguageSwitcher() {
    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
    };

    return (
      <div>
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('ko')}>한국어</button>
        <button onClick={() => changeLanguage('ja')}>日本語</button>
      </div>
    );
  }
  ```

---

### **Best Practices**

#### **Key Structure**

- Use dot notation for hierarchical keys (e.g., `component.subcomponent.element.property`).
- Group related translations under common prefixes (e.g., all sign-in related texts under `signIn.*`).
- Keep consistent naming conventions for keys across language files.

#### **Fallback Handling**

- Always provide complete translations in the fallback language (typically English).
- Use namespaces for modular loading of translations when dealing with large applications.

#### **Development Workflow**

- Add new keys to all language files simultaneously to avoid missing translations.
- Comment complex or context-dependent translations in the default language file.
- Use the same key structure across all language files.

#### **Performance Considerations**

- Use translation key references (`t('key')`) instead of direct string access.
- For components with many translations, consider using the `useTranslation` hook from react-i18next to avoid unnecessary re-renders.
- For large applications, use namespaces to load translations on demand:

  ```tsx
  import { useTranslation } from 'react-i18next';

  function MyComponent() {
    const { t } = useTranslation('namespace');
    return <h1>{t('key')}</h1>;
  }
  ```

#### **Format Handling**

- For dates, numbers, and currencies, use specialized formatting:

  ```tsx
  // Date formatting
  import { format } from 'date-fns';
  import { ko, ja, enUS } from 'date-fns/locale';

  const locales = { en: enUS, ko, ja };
  const currentLocale = locales[i18n.language] || enUS;

  // Format date according to current locale
  const formattedDate = format(new Date(), 'PPP', { locale: currentLocale });
  ```

  ```tsx
  // Number and currency formatting
  const formatter = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: 'USD',
  });

  const formattedPrice = formatter.format(price);
  ```

---

### **Integration with Convex**

- Use the locale in Convex function calls when language-specific operations are needed:

  ```tsx
  import { useConvexAuth } from 'convex/react';
  import { useAuthActions } from '@convex-dev/auth/react';
  import { getLocale } from '../lib/i18n';

  function SignIn() {
    const { signIn } = useAuthActions();

    // Use the appropriate provider ID based on current locale
    const locale = getLocale();
    const providerId = `resend-otp-${locale}`;

    const handleSignIn = async (email) => {
      await signIn(providerId, { email });
    };

    // Component JSX
  }
  ```

- Store user language preferences in the Convex database for persistence:

  ```typescript
  // Convex function to update user language preference
  export const updateLanguagePreference = mutation({
    args: {
      userId: v.id('users'),
      language: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
      await ctx.db.patch(args.userId, {
        languagePreference: args.language,
      });
      return null;
    },
  });
  ```

---

### **Example: Complete i18n Implementation**

**Task**: Create a sign-in form with internationalization support for English, Korean, and Japanese.

**Requirements**:

- Translation files for all supported languages.
- Language switching capability.
- Properly structured translation keys.
- Effective use of the translation utility.

**Implementation**:

```tsx
// src/components/pages/SignIn.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConvexAuth } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { t, getLocale } from '../../lib/i18n';
import { cn } from '../../lib/utils';

export default function SignIn() {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  // Use locale-specific provider
  const locale = getLocale();
  const providerId = `resend-otp-${locale}`;

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      await signIn(providerId, { email });
      setIsCodeSent(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cn('flex flex-col h-screen')}>
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full max-w-md p-8 rounded-xl bg-background/80 backdrop-blur-md border border-border/50 shadow-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-center">
            {t('signIn.title')}
          </h2>

          {!isCodeSent ? (
            <form onSubmit={handleSendCode} className="mt-8 space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  {t('signIn.emailLabel')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('signIn.emailPlaceholder')}
                  className={cn(
                    'w-full px-4 py-3 rounded-md',
                    'bg-background/50 backdrop-blur-sm',
                    'border border-border/50 outline-none',
                    'focus-visible:ring-2 focus-visible:ring-primary/50',
                    'focus-visible:border-primary/50 transition-all',
                  )}
                />
              </div>

              <button
                type="submit"
                className={cn(
                  'w-full py-3 rounded-lg font-medium',
                  'bg-gradient-to-r from-primary to-primary/90',
                  'text-primary-foreground shadow-lg',
                  'hover:from-primary/90 hover:to-primary/80',
                  'transition-all',
                )}
              >
                {t('signIn.signInWithEmail')}
              </button>
            </form>
          ) : (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t('signIn.verifyEmailMessage')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

### **Development Console Utilities**

- Always use development-only console utilities instead of direct `console` methods in client-side code.
- Import and use `devLog` and `devConsole` from `src/lib/utils.ts`:

  ```typescript
  import { devLog, devConsole } from '../lib/utils';

  // Use devLog for simple logging (replaces console.log)
  devLog('This message only appears in development mode');
  devLog('User data:', userData);

  // Use devConsole for different log levels
  devConsole.log('General information');
  devConsole.warn('Warning message');
  devConsole.error('Error occurred:', error);
  devConsole.info('Info message');
  devConsole.debug('Debug information');
  ```

- These utilities automatically check `import.meta.env.DEV` and only output logs in development mode.
- Never use direct `console.log`, `console.error`, etc. in client code - always use the dev utilities.
- This ensures no console output appears in production builds, improving performance and security.

---
