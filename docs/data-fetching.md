# Data Fetching

## ⚠️ CRITICAL: Server Components Only

ALL data fetching within this app **must** be done via **server components**.

Data must **NOT** be fetched via:
- Route handlers (API routes)
- Client components
- Any other mechanism

**ONLY server components** are permitted to fetch data. This is incredibly important and must be followed without exception.

---

## ⚠️ CRITICAL: Database Queries via Helper Functions Only

All database queries **must** be done via helper functions located in the `/data` directory.

### Rules

- **Always** use helper functions from `/data` to query the database.
- These helper functions **must** use **Drizzle ORM** to interact with the database.
- **DO NOT USE RAW SQL** under any circumstances.

### User Data Isolation

It is critically important that a logged-in user can **only access their own data**.

- Every query that returns user data **must** be scoped to the currently authenticated user's ID.
- Users **must not** be able to access any other user's data.
- Always retrieve the current user's ID (e.g., via `auth()` from Clerk) inside the helper function and filter queries by it.

### Example Pattern

```ts
// /data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getUserWorkouts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

```tsx
// app/dashboard/page.tsx (Server Component)
import { getUserWorkouts } from "@/data/workouts";

export default async function DashboardPage() {
  const workouts = await getUserWorkouts();
  // render...
}
```
