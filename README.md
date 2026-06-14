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

## Running the app

### Backend

Run it locally with Python:

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

…or with Docker:

```bash
cd backend
docker build -t product-rbac-api .
docker run -p 8000:8000 product-rbac-api
```

Either way the API is at http://localhost:8000 and the docs at
http://localhost:8000/docs.

### Frontend

In a second terminal:

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
