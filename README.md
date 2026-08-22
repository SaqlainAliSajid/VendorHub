# VendorHub AI frontend

Responsive buyer-side frontend created from the supplied layouts.

## Routes

- `/` — VendorHub AI landing page
- `/search?q=industrial%20textiles` — AI supplier-search results
- `/login` — buyer sign-in screen
- `/dashboard` — buyer sourcing dashboard
- `/signup` — buyer account creation
- `/forgot-password` — password recovery
- `/verify-email` — email verification / 2FA verification
- `/vendors/[id]` — verified supplier profile
- `/catalog` — supplier product catalog

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Connecting the backend

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_BASE_URL` to the backend origin. When that environment variable is empty, the screens use the included mock data so every layout remains usable.

The API adapter is in `src/lib/api/vendorhub.ts`. The expected endpoints are:

```text
POST /v1/auth/login
GET  /v1/suppliers/search?q={query}
GET  /v1/buyer/dashboard
```

Each endpoint may return its data directly or inside `{ "data": ... }`. Shared DTOs are defined in `src/lib/api/types.ts`; update them alongside the backend contract when needed.

## Verification

`npm run typecheck` and `npm run build` both pass.
