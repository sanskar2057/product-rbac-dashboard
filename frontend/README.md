# Product Management Dashboard

A product management dashboard with role-based access control (RBAC).
Authenticated users can view, create, edit, and delete products — and what they
can do depends on their role.

Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**, talking
to a **FastAPI** backend that enforces RBAC and issues JWTs.

> The backend lives in the [`../backend`](../backend) folder and has its own
> README with full API documentation.

## Tech stack

| Area             | Choice                                              |
| ---------------- | --------------------------------------------------- |
| Framework        | Next.js 16 (App Router)                             |
| Language         | TypeScript                                          |
| Styling          | Tailwind CSS v4 (class-based dark mode)             |
| State            | React Context (auth, theme, toasts)                 |
| Icons            | lucide-react                                        |
| Backend          | FastAPI + JWT (separate service)                    |

## Getting started

### 1. Run the backend

The dashboard needs the API running first — see [`../backend/README.md`](../backend/README.md).
In short:

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Run the frontend

```bash
cd frontend
npm install
cp .env.example .env.local        # points at http://localhost:8000
npm run dev
```

Open http://localhost:3000.

### Demo accounts

Sign in with any of these (or use the quick-fill buttons on the login screen).
Password for all: **`password123`**.

| Email                | Role   | What they can do                       |
| -------------------- | ------ | -------------------------------------- |
| admin@example.com    | Admin  | View, add, edit, delete                |
| editor@example.com   | Editor | View, edit                             |
| viewer@example.com   | Viewer | View only                              |

## Features

- **Authentication** – JWT-based login, session persisted in `localStorage`,
  silent access-token refresh on expiry, and automatic sign-out when the refresh
  token is no longer valid.
- **Protected routes** – the dashboard is wrapped in an auth guard that redirects
  unauthenticated users to the login page.
- **RBAC** – actions (add / edit / delete) appear only when the user's role
  allows them; the backend re-checks every request.
- **Products** – list with **search**, **category/status filters**, and
  **pagination**; create/edit via a validated modal form; delete with a
  confirmation dialog.
- **UX** – loading, empty, and error states; toast notifications; responsive
  layout (table on desktop, cards on mobile); light/dark theme with no flash on
  load.

## How RBAC works

Roles map to permissions in one place — [`lib/permissions.ts`](lib/permissions.ts):

```ts
admin  → read, create, update, delete
editor → read, update
viewer → read
```

The login response includes the user's role and resolved permissions. From there:

1. **UI gating** – the [`<Can permission="...">`](components/Can.tsx) component and
   `useAuth().hasPermission(...)` hide buttons and table actions a user can't use,
   so a viewer never sees an "Add product" button.
2. **Server enforcement** – this is the real boundary. Every product endpoint is
   guarded server-side, so even a crafted request from the wrong role returns
   `403`. The client map is a convenience copy, not the source of truth.

This keeps the UI honest without trusting the client for security.

## API integration

A small fetch wrapper in [`services/apiClient.ts`](services/apiClient.ts) handles
the cross-cutting concerns so feature code stays clean:

- attaches the `Authorization: Bearer <token>` header,
- on a `401`, transparently calls `/auth/refresh` once and replays the request,
- if the refresh fails, clears the session and bounces the user to `/login`,
- normalizes error messages (including FastAPI validation errors) into an
  `ApiError`.

Feature modules ([`authService`](services/authService.ts),
[`productService`](services/productService.ts)) build on top of it, and the
[`useProducts`](hooks/useProducts.ts) hook wires fetching, filters, and pagination
to the UI (with request cancellation via `AbortController`).

## Project structure

```
frontend/
├── app/
│   ├── (dashboard)/          # auth-guarded routes + navbar
│   │   ├── layout.tsx
│   │   └── products/page.tsx
│   ├── login/page.tsx
│   ├── layout.tsx            # providers + no-flash theme script
│   └── page.tsx              # entry redirect
├── components/               # UI primitives, products, feedback states
├── context/                  # auth, theme, toast providers
├── hooks/                    # useProducts, useDebounce
├── lib/                      # permissions, constants
├── services/                 # api client + feature services + token store
├── types/                    # shared TypeScript types
└── utils/                    # cn, formatting, validation
```

## Configuration

| Variable              | Default                 | Description           |
| --------------------- | ----------------------- | --------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Base URL of the API.  |

## Assumptions & limitations

- Backend storage is in-memory, so products reset when the API restarts.
- Users and the demo password are hardcoded on the backend for evaluation.
- Tokens are kept in `localStorage` for simplicity. A production app would likely
  prefer httpOnly cookies to reduce XSS exposure.
- No automated tests are included; the focus was on the feature set and structure
  within the time box.
