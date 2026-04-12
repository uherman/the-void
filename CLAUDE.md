# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run lint      # ESLint (flat config, next/core-web-vitals + typescript)
npx tsc --noEmit  # Type check without emitting
```

## Architecture

This is a lightweight anonymous social media app built with Next.js 16 (App Router), Supabase (Postgres + Realtime), and Tailwind CSS 4.

### Dual Supabase Client Pattern

- **Browser client** (`src/lib/supabase/browser.ts`): Uses the publishable/anon key. Read-only (RLS has SELECT-only policies for anon). Module-level singleton. Used for queries and realtime subscriptions in client components.
- **Server client** (`src/lib/supabase/server.ts`): Uses the service_role key. Bypasses RLS. Used exclusively in server actions (`src/actions/`) for all writes.

All mutations go through Next.js Server Actions as a write gateway. The anon/browser client cannot insert or update data.

### Anonymous Identity Model

Users get a UUID generated via `crypto.randomUUID()` stored in `localStorage`. This UUID is the primary key in the `users` table. There is no Supabase Auth, no sessions, no cookies, no middleware. The `UserProvider` (`src/lib/user-context.tsx`) uses `useSyncExternalStore` with a module-level external store to avoid React compiler warnings about setState in effects.

### Realtime Strategy

Hooks in `src/hooks/` subscribe to Postgres INSERT changes on base tables (`thoughts`, `comments`). When an event arrives, they re-fetch the row from enriched database views (`thoughts_with_meta`, `comments_with_author`) to get joined author names and comment counts. This avoids denormalization in the realtime payload.

### Server Action Validation

All server actions validate UUID format, verify user/thought existence, enforce content length limits, and apply rate limiting by checking the `created_at` of the user's most recent row (10s cooldown for thoughts, 5s for comments). Constants live in `src/lib/constants.ts`.

### Tailwind v4 + Dark Mode

Tailwind 4 uses CSS-based config in `globals.css` (no `tailwind.config.ts`). Dark mode uses `@custom-variant dark (&:where(.dark, .dark *))` for class-based toggling via `next-themes`.

## Database

Schema is in `supabase/migrations/001_initial_schema.sql`. Three tables (`users`, `thoughts`, `comments`), two views (`thoughts_with_meta`, `comments_with_author`). RLS is enabled with anon SELECT-only policies. Realtime is enabled on `thoughts` and `comments` tables.
