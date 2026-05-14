# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FIT.AI — a fitness training web app built with Next.js 16 (App Router). The backend API serves an OpenAPI spec at `/swagger.json` and handles authentication via BetterAuth with Google OAuth.

## Commands

```bash
npm run dev      # Start dev server (do NOT run this to verify changes)
npm run build    # Production build
npm run lint     # Run ESLint
npx orval        # Regenerate API client from backend OpenAPI spec
npx shadcn@latest add <component>  # Install a shadcn/ui component
```

## Architecture

### Path Aliases

`@/*` maps to the project root (`./`). Example: `@/components/ui/button`, `@/app/_lib/auth-client`.

### App Structure

- `app/` — Next.js App Router pages and app-level code
  - `app/_lib/` — Internal libraries (auth client, API layer, fetch mutator)
  - `app/_lib/api/fetch-generated/` — Orval-generated fetch functions for Server Components
  - `app/_lib/auth-client.ts` — BetterAuth client instance (`authClient`)
  - `app/_lib/fetch.ts` — Custom fetch mutator (`customFetch`) that prepends API URL and forwards cookies via `next/headers`
  - `app/_components/` — App-level shared components
- `components/ui/` — shadcn/ui components (new-york style, lucide icons)
- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)

### API Layer (Orval)

Two Orval output targets exist in `orval.config.ts`:

1. **`fetch`** (active) — Generates plain fetch functions to `app/_lib/api/fetch-generated/index.ts`. Used in Server Components only (relies on `next/headers` for cookie forwarding via `customFetch`).
2. **`rc`** (commented out) — Will generate TanStack Query hooks to `lib/api/rc-generated/index.ts` using an axios mutator. Used in Client Components.

The API base URL comes from `NEXT_PUBLIC_API_URL`. Run `npx orval` whenever the backend schema changes. If a needed function is absent after running orval, stop and notify the user.

### Authentication

- Uses BetterAuth client from `app/_lib/auth-client.ts`
- No middleware — auth checks happen directly in each page
- Server Components: `authClient.getSession({ fetchOptions: { headers: await headers() } })`
- Client Components: `authClient.useSession()` hook
- Protected pages redirect to `/auth`; `/auth` redirects to `/` if already logged in
- Never wrap `authClient` calls in try/catch — destructure `error` from the result instead

### Styling

- Tailwind CSS v4 with oklch color variables defined in `app/globals.css`
- Always use theme CSS variables (e.g., `bg-primary`, `text-muted-foreground`), never hardcoded Tailwind colors
- Custom variables beyond standard shadcn tokens: `--auth-card-bg`, `--auth-card-text`, `--auth-google-bg`, `--auth-google-text`, `--streak`, `--online`, `--chart-1` through `--chart-5`
- Fonts: Geist Sans (`--font-geist-sans`), Geist Mono (`--font-geist-mono`), Inter Tight (`--font-inter-tight` / `--font-heading`), Anton (`--font-anton`)

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:3333   # Backend API URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Frontend URL
```

## Key Conventions

- Package manager: **npm**
- Date library: **dayjs** (never use native Date formatting)
- No comments in code
- kebab-case for file and folder names
- One component per file
- Never run `npm run dev` to verify changes
- Never use middleware for auth
- Use `Image` from `next/image` for all images
- Use `Button` from `@/components/ui/button`, never `<button>` directly
- Forms: React Hook Form + Zod + shadcn/ui `Form` component
- Detailed coding rules live in `.claude/rules/` (api.md, react.md, typescript.md, general.md)
