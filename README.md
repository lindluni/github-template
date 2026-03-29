# GitHub Template

A Next.js application template with GitHub OAuth authentication, SQLite database, and shadcn/ui components.

## Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Authentication**: [Better Auth](https://better-auth.com) with GitHub OAuth
- **Database**: [SQLite](https://www.sqlite.org) via better-sqlite3
- **UI**: [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS](https://tailwindcss.com)
- **Theming**: Light/Dark mode via next-themes

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in the values:

- `BETTER_AUTH_SECRET` — Generate with `openssl rand -base64 32`
- `BETTER_AUTH_URL` — Your app URL (default: `http://localhost:3000`)
- `GITHUB_CLIENT_ID` — From your [GitHub OAuth App](https://github.com/settings/developers)
- `GITHUB_CLIENT_SECRET` — From your GitHub OAuth App

> **GitHub OAuth callback URL**: Set to `http://localhost:3000/api/auth/callback/github`

### 3. Run database migrations

```bash
npx auth@latest migrate
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...all]/route.ts   # Better Auth API handler
│   ├── dashboard/
│   │   ├── page.tsx                  # Protected dashboard (server)
│   │   └── dashboard-content.tsx     # Dashboard UI (client)
│   ├── layout.tsx                    # Root layout with ThemeProvider
│   ├── page.tsx                      # Login page
│   └── globals.css                   # Theme variables (light/dark)
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── header.tsx                    # App header with user menu
│   ├── theme-provider.tsx            # next-themes provider
│   ├── theme-toggle.tsx              # Light/dark mode toggle
│   └── user-menu.tsx                 # User avatar dropdown
├── lib/
│   ├── auth.ts                       # Better Auth server config
│   ├── auth-client.ts                # Better Auth client
│   └── utils.ts                      # Utility functions
└── proxy.ts                          # Auth route protection (Next.js 16)
```
