# Product Management Dashboard (RBAC)

A full-stack product management dashboard with role-based access control.
Authenticated users can view, add, edit, and delete products, gated by their role.

- **`frontend/`** — Next.js (App Router) + TypeScript + Tailwind CSS
- **`backend/`** — FastAPI + JWT, enforces RBAC on every route

Each folder has its own README with details. The backend README also contains the
full API documentation.

## Roles

| Role   | View | Add | Edit | Delete |
| ------ | :--: | :-: | :--: | :----: |
| Admin  |  ✅  | ✅  |  ✅  |   ✅   |
| Editor |  ✅  | ❌  |  ✅  |   ❌   |
| Viewer |  ✅  | ❌  |  ❌  |   ❌   |

## Run with Docker (one command)

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend + docs: http://localhost:8000/docs

## Run locally

**Backend**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend** (in a second terminal)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

## Demo accounts

Password for all accounts: **`password123`**

| Email                | Role   |
| -------------------- | ------ |
| admin@example.com    | Admin  |
| editor@example.com   | Editor |
| viewer@example.com   | Viewer |
