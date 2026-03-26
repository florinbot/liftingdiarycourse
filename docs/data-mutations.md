# Data Mutations

## ⚠️ CRITICAL: Server Actions Only

ALL data mutations within this app **must** be done via **server actions**.

Mutations must **NOT** be done via:
- Route handlers (API routes)
- Client-side fetch/axios calls
- Direct database calls from components

**ONLY server actions** are permitted to mutate data. This is incredibly important and must be followed without exception.

---

## ⚠️ CRITICAL: Database Mutations via Helper Functions Only

All database mutations **must** be done via helper functions located in the `src/data` directory.

### Rules

- **Always** use helper functions from `src/data` to write to the database.
- These helper functions **must** use **Drizzle ORM** to interact with the database.
- **DO NOT USE RAW SQL** under any circumstances.
- Helper functions in `src/data` are the **only** place where `db` is called directly for mutations.

### User Data Isolation

It is critically important that a logged-in user can **only mutate their own data**.

- Every mutation that writes user data **must** be scoped to the currently authenticated user's ID.
- Users **must not** be able to mutate any other user's data.
- Always retrieve the current user's ID (e.g., via `auth()` from Clerk) inside the helper function and enforce ownership before writing.

---

## Server Action File Placement

Server actions **must** live in colocated `actions.ts` files, placed alongside the route or feature they belong to.

```
src/app/
└── dashboard/
    └── workouts/
        ├── page.tsx
        ├── actions.ts   ✅ correct location
        └── _components/
            └── workout-form.tsx
```

Do **not** put server actions in:
- Component files
- `src/data/` files (those are DB helper functions, not actions)
- A shared global `actions.ts` at the app root

---

## Server Action Rules

### 1. Must use `"use server"` directive

Every `actions.ts` file must begin with the `"use server"` directive.

```ts
"use server";
```

### 2. Parameters must be explicitly typed — no `FormData`

Server action function parameters **must** be typed with explicit TypeScript types. `FormData` is **not permitted** as a parameter type.

```ts
// ✅ Correct
export async function createWorkout(params: CreateWorkoutParams) { ... }

// ❌ Wrong — FormData is not allowed
export async function createWorkout(formData: FormData) { ... }
```

### 3. No redirects inside server actions

Server actions **must not** call `redirect()`. Redirecting is the responsibility of the client component after the action resolves.

```ts
// ✅ Correct — redirect handled client-side
"use client";
import { useRouter } from "next/navigation";
import { createWorkoutAction } from "../actions";

export function CreateWorkoutForm() {
  const router = useRouter();

  async function handleSubmit() {
    await createWorkoutAction({ ... });
    router.push("/dashboard"); // redirect after action resolves
  }
}

// ❌ Wrong — redirect inside server action
"use server";
import { redirect } from "next/navigation";

export async function createWorkoutAction(params: CreateWorkoutParams) {
  await createWorkout(params);
  redirect("/dashboard"); // not allowed
}
```

### 4. All parameters must be validated with Zod

Every server action **must** validate its arguments using a Zod schema before performing any work.

```ts
import { z } from "zod";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
  startedAt: z.date(),
  notes: z.string().optional(),
});
```

Validation failures must be handled — either by throwing or returning an error result. Do not proceed with invalid input.

---

## Example Patterns

### `src/data/workouts.ts` — DB helper function

```ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function createWorkout(data: {
  name?: string;
  startedAt: Date;
  notes?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [workout] = await db
    .insert(workouts)
    .values({
      userId,
      name: data.name,
      startedAt: data.startedAt,
      notes: data.notes,
    })
    .returning();

  return workout;
}
```

### `src/app/dashboard/workouts/actions.ts` — Server action

```ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  startedAt: z.date(),
  notes: z.string().max(1000).optional(),
});

type CreateWorkoutParams = z.infer<typeof createWorkoutSchema>;

export async function createWorkoutAction(params: CreateWorkoutParams) {
  const parsed = createWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  return createWorkout(parsed.data);
}
```

### Client component calling the action

```tsx
"use client";

import { createWorkoutAction } from "../actions";

export function CreateWorkoutButton() {
  async function handleClick() {
    await createWorkoutAction({
      name: "Morning Session",
      startedAt: new Date(),
    });
  }

  return <button onClick={handleClick}>Start Workout</button>;
}
```

---

## Summary Checklist

| Rule | Requirement |
|------|-------------|
| Mutation mechanism | Server actions only |
| DB writes | Via helper functions in `src/data/` using Drizzle ORM |
| Action file location | Colocated `actions.ts` next to the relevant route |
| `"use server"` | Required at the top of every `actions.ts` |
| Parameter types | Explicit TypeScript types — no `FormData` |
| Input validation | Zod schema validation required in every action |
| Redirects | Never inside server actions — use `router.push()` client-side after the action resolves |
| User data isolation | Auth check + userId scoping enforced in `src/data/` helpers |
| Raw SQL | Never permitted |
