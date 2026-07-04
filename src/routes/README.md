# Routes

TanStack Start uses **file-based routing**. Every `.tsx` file in this directory
is a route. Do **not** create `src/pages/`, `src/routes/_app/index.tsx`, or
`app/layout.tsx` — those are Next.js / Remix conventions. The only root layout
is `src/routes/__root.tsx`.

## Conventions

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `causes.index.tsx` | `/causes` |
| `causes.$id.tsx` | `/causes/:id` (dynamic — bare `$`, no curly braces) |
| `admin/login.tsx` | `/admin/login` |
| `admin/setup-2fa.tsx` | `/admin/setup-2fa` |
| `admin/dashboard.tsx` | `/admin/dashboard` |
| `admin/causes.tsx` | `/admin/causes` |
| `admin/payment-settings.tsx` | `/admin/payment-settings` |
| `admin/site-settings.tsx` | `/admin/site-settings` |
| `admin/users.tsx` | `/admin/users` |
| `__root.tsx` | app shell — wraps every page; preserve `<Outlet />` |

`routeTree.gen.ts` is auto-generated. Don't edit it by hand.
