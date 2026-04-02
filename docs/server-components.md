# Server Component Coding Standards

## Params and Search Params Must Be Awaited

This project uses **Next.js 15**, where `params` and `searchParams` are **Promises**. They must always be awaited before accessing their properties.

### Rules

- **Always `await` params** in server components — do not destructure or access properties synchronously.
- **Always `await` searchParams** in server components — same rule applies.
- This applies to all dynamic route segments (`[id]`, `[workoutId]`, `[slug]`, etc.).

### Examples

```tsx
// ✅ Correct — params is awaited
export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  // ...
}

// ✅ Correct — searchParams is awaited
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  // ...
}

// ❌ Wrong — params not awaited
export default async function WorkoutPage({
  params,
}: {
  params: { workoutId: string };
}) {
  const { workoutId } = params; // do not do this
  // ...
}
```

### Type Signatures

Always type `params` and `searchParams` as `Promise<...>`:

```tsx
// Dynamic route: /dashboard/workout/[workoutId]
params: Promise<{ workoutId: string }>

// Dynamic route with multiple segments: /dashboard/[userId]/workout/[workoutId]
params: Promise<{ userId: string; workoutId: string }>

// Search params
searchParams: Promise<{ date?: string; filter?: string }>
```
