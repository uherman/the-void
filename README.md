# The Void

An anonymous social media app where anyone can share thoughts with the void and comment — no accounts, no passwords, no tracking.

## Tech Stack

- **Next.js 16** (App Router, Turbopack, Server Actions)
- **React 19**
- **Supabase** (Postgres + Realtime)
- **Tailwind CSS 4**
- **Framer Motion**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint
```

## How It Works

Users get a random identity stored in `localStorage` — no sign-up required. All writes go through Next.js Server Actions with rate limiting (10s cooldown for thoughts, 5s for comments). The feed updates in real-time via Supabase Realtime subscriptions.
