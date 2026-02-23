# UI Coding Standards

## Component Library

**Only shadcn/ui components are permitted in this project.**

All UI must be built exclusively using [shadcn/ui](https://ui.shadcn.com/) components. No custom components may be created under any circumstances.

### Rules

- **No custom components.** Do not create bespoke UI components (e.g. custom buttons, inputs, cards, modals, badges, etc.). Every UI element must come from the shadcn/ui library.
- **No raw HTML UI elements.** Do not use bare `<button>`, `<input>`, `<select>`, `<dialog>`, etc. Use the shadcn/ui equivalents.
- **No third-party component libraries.** Do not install or use other component libraries (e.g. MUI, Chakra UI, Radix primitives directly, Headless UI, etc.). shadcn/ui is the only permitted component source.
- **Tailwind CSS for layout and spacing only.** Tailwind utility classes may be used for layout, spacing, and positioning. They must not be used to build UI elements that should come from shadcn/ui.

### Adding Components

Install shadcn/ui components via the CLI before use:

```bash
npx shadcn@latest add <component-name>
```

Example:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

Installed components land in `src/components/ui/`. Import from there:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
```

---

## Date Formatting

All dates must be formatted using [date-fns](https://date-fns.org/). Do not use `Date.toLocaleDateString()`, `Intl.DateTimeFormat`, or any other date formatting approach.

### Required Format

Dates must display as: **ordinal day, abbreviated month, full year**

| Date | Formatted output |
|------|-----------------|
| 2025-09-01 | 1st Sep 2025 |
| 2024-08-02 | 2nd Aug 2024 |
| 2026-01-03 | 3rd Jan 2026 |
| 2023-06-05 | 5th Jun 2023 |

### Implementation

Use the `do MMM yyyy` format string with `format` from date-fns:

```ts
import { format } from "date-fns"

format(new Date("2025-09-01"), "do MMM yyyy") // "1st Sep 2025"
format(new Date("2024-08-02"), "do MMM yyyy") // "2nd Aug 2024"
format(new Date("2026-01-03"), "do MMM yyyy") // "3rd Jan 2026"
format(new Date("2023-06-05"), "do MMM yyyy") // "5th Jun 2023"
```

### Installing date-fns

```bash
npm install date-fns
```
