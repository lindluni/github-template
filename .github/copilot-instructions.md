# Copilot Instructions

## Workflow

Always run the `/commit` command at the end of every turn that produces code changes.

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run lint` — Check linting and formatting (Biome)
- `npm run lint:fix` — Auto-fix lint and formatting issues
- `npm test` — Run all tests (Vitest)
- `npm run test:watch` — Run tests in watch mode
- `npx vitest run src/lib/utils.test.ts` — Run a single test file
- `npx vitest run -t "renders the welcome"` — Run tests matching a name pattern
- `npx auth@latest migrate` — Run Better Auth database migrations after schema changes

## Architecture

This is a Next.js 16 (App Router) template using GitHub OAuth as the sole authentication method. There is no email/password sign-in.

### Auth flow

Authentication uses **better-auth** with a SQLite database (better-sqlite3). The auth system is split into two modules:

- `src/lib/auth.ts` — Server-side auth instance. Used in server components, API routes, and the proxy. Access the session with `auth.api.getSession({ headers: await headers() })`.
- `src/lib/auth-client.ts` — Client-side auth hooks. Used in client components. Access the session with `authClient.useSession()`, trigger sign-in with `authClient.signIn.social({ provider: "github" })`.

The API route at `src/app/api/auth/[...all]/route.ts` mounts the better-auth handler. The GitHub OAuth callback URL is `{BASE_URL}/api/auth/callback/github`.

### Route protection (two layers)

1. **Proxy** (`src/proxy.ts`) — Checks for a session cookie on `/dashboard/*` routes and redirects unauthenticated users to `/`. This is a fast, optimistic check — it does not validate the session.
2. **Server component** (`src/app/dashboard/page.tsx`) — Validates the session against the database and redirects if invalid. This is the authoritative check.

Both layers must remain in place. The proxy prevents unnecessary server work; the page-level check provides actual security.

### Server/client component split

Protected pages follow this pattern:

- A **server component** (`page.tsx`) fetches and validates the session, then passes `session.user` as props to a client component.
- A **client component** (`*-content.tsx`) renders the interactive UI.

This avoids exposing auth logic to the client while keeping interactive features in client components.

### Theming

Theme switching uses `next-themes` with class-based toggling (`attribute="class"` on the ThemeProvider). The `<html>` tag must include `suppressHydrationWarning`.

Dark mode uses **dark grey backgrounds, not black or blue**. All dark theme colors in `src/app/globals.css` use `oklch` with zero chroma (pure neutral greys). When modifying or adding dark theme colors, maintain this convention — no blue tints, no pure black.

## Conventions

### Formatting (Biome)

- 4-space indentation
- Double quotes for JavaScript/TypeScript
- Biome handles both linting and formatting — there is no Prettier or ESLint
- CSS files are excluded from Biome formatting (Tailwind manages them)
- shadcn/ui components (`src/components/ui/`) are excluded from linting — they are generated code

### Adding shadcn components

```bash
npx shadcn@latest add <component-name>
```

Components are generated into `src/components/ui/`. Do not manually edit these files — they will be overwritten by future `shadcn add` commands. Custom components go in `src/components/`.

### Testing

Tests use Vitest with React Testing Library and live alongside the code they test (`*.test.ts` / `*.test.tsx`). The test setup file at `src/__tests__/setup.ts` loads jest-dom matchers globally.

When testing components that use `next-themes`, `next/navigation`, or `@/lib/auth-client`, mock them with `vi.mock()`. Note that `vi.mock` is hoisted — you cannot reference `const` variables declared before the mock in the factory function. Use a wrapper function pattern instead:

```ts
const mockFn = vi.fn();
vi.mock("@/lib/auth-client", () => ({
    authClient: {
        signIn: { social: (...args: unknown[]) => mockFn(...args) },
    },
}));
```

shadcn `CardTitle` renders as a `<div>` (not a heading element) — use `getByText` instead of `getByRole("heading")` when querying card titles.

### Environment variables

Required variables are documented in `.env.example`. The app needs `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GITHUB_CLIENT_ID`, and `GITHUB_CLIENT_SECRET`. The SQLite database file (`sqlite.db`) is created automatically and is gitignored.
