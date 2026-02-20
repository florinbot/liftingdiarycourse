# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application built with React 19, TypeScript, and Tailwind CSS 4. The project uses the App Router architecture with Clerk authentication for user management.

## Development Commands

**Start development server:**
```bash
npm run dev
```
Runs on http://localhost:3000 with hot reload enabled.

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

**Lint code:**
```bash
npm run lint
```

## Architecture

- **Framework:** Next.js 16 with App Router (file-based routing in `src/app/`)
- **Authentication:** Clerk (`@clerk/nextjs`) with `clerkMiddleware()` in `src/middleware.ts`
- **Styling:** Tailwind CSS 4 via PostCSS
- **TypeScript:** Configured with strict mode enabled and path aliases (`@/*` → `src/*`)
- **Fonts:** Uses Next.js font optimization with Geist Sans and Geist Mono from Google Fonts
- **ESLint:** Uses Next.js ESLint config with TypeScript and Core Web Vitals rules

### Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with ClerkProvider and auth UI
│   ├── page.tsx        # Home page
│   └── globals.css     # Global Tailwind styles
└── middleware.ts       # Clerk middleware with route protection
```

### Key Patterns

- All pages and layouts use TypeScript with `.tsx` extensions
- Font variables are injected at the root layout level (`--font-geist-sans`, `--font-geist-mono`)
- The app supports dark mode via Tailwind's `dark:` prefix
- Path aliases: Use `@/` to import from the `src/` directory

### Clerk Authentication

- **Middleware:** Uses `clerkMiddleware()` from `@clerk/nextjs/server` in `src/middleware.ts`
- **Provider:** App is wrapped with `<ClerkProvider>` in `app/layout.tsx`
- **Components:** Uses Clerk's prebuilt components (`<SignInButton>`, `<SignUpButton>`, `<UserButton>`, `<SignedIn>`, `<SignedOut>`)
- **Server-side auth:** Use `auth()` from `@clerk/nextjs/server` in server components/actions (with async/await)
- **Environment variables:** Clerk keys are stored in `.env.local` (gitignored)
