# Routing

## Route Structure

All application routes must be nested under `/dashboard`. There should be no top-level application pages outside of `/dashboard` (aside from the root landing page or auth pages).

**Examples:**
- `/dashboard` — main dashboard
- `/dashboard/workout/[workoutId]` — individual workout view
- `/dashboard/settings` — user settings

## Route Protection

The `/dashboard` route and all sub-routes are protected and accessible only by authenticated (logged-in) users.

Route protection must be implemented via **Next.js middleware** (`src/middleware.ts`). Do not rely on layout-level redirects or client-side guards as the primary protection mechanism.

Use Clerk's `clerkMiddleware()` with route matching to protect all `/dashboard` routes:

```ts
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

Unauthenticated users attempting to access any `/dashboard` route will be redirected to the Clerk sign-in page automatically via `auth.protect()`.
