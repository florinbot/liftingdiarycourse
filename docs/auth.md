# Authentication Coding Standards

## ⚠️ CRITICAL: Clerk is the Only Authentication Solution

This app uses **Clerk** for all authentication. Do **not** implement custom auth, use NextAuth, or any other authentication library.

---

## Provider Setup

The entire app must be wrapped with `<ClerkProvider>` in the root layout. This is already configured in `src/app/layout.tsx` and must not be removed or replaced.

```tsx
// src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

---

## Middleware & Route Protection

Route protection is handled via `clerkMiddleware()` in `src/middleware.ts`. Use `createRouteMatcher` to define protected routes and call `auth.protect()` to enforce authentication.

```ts
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});
```

### Rules

- **All authenticated routes must be protected in middleware.** Do not rely solely on server-side checks.
- Add new protected route patterns to the `createRouteMatcher` array in `src/middleware.ts`.
- Public routes (e.g. landing page, marketing pages) require no changes — they are accessible by default.

---

## UI Components

Use Clerk's prebuilt components for all auth-related UI. Do not build custom sign-in, sign-up, or user profile UIs.

| Component | Usage |
|-----------|-------|
| `<SignedIn>` | Renders children only when the user is authenticated |
| `<SignedOut>` | Renders children only when the user is not authenticated |
| `<SignInButton>` | Triggers the Clerk sign-in flow |
| `<SignUpButton>` | Triggers the Clerk sign-up flow |
| `<UserButton>` | Displays the authenticated user's avatar and account menu |

```tsx
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

<SignedOut>
  <SignInButton mode="modal" />
  <SignUpButton mode="modal" />
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

- Always use `mode="modal"` for `<SignInButton>` and `<SignUpButton>`.
- Import UI components from `@clerk/nextjs` (not `@clerk/nextjs/server`).

---

## Server-Side Auth

Use `auth()` from `@clerk/nextjs/server` in server components and data helper functions to retrieve the current user's ID.

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) throw new Error("Unauthorized");
```

### Rules

- Always `await` the `auth()` call — it is async.
- Always check that `userId` is not null before proceeding.
- **Never** use `auth()` in client components — it is server-only.
- Import `auth` from `@clerk/nextjs/server`, not from `@clerk/nextjs`.

---

## Environment Variables

Clerk requires the following keys in `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

- `.env.local` is gitignored and must never be committed.
- Never hardcode or log these values.
