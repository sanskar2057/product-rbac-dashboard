# Product RBAC API

FastAPI backend for the Product Management Dashboard. It handles JWT
authentication and enforces role-based access control on every product route.

## Tech stack

- **FastAPI** – web framework and automatic OpenAPI docs
- **PyJWT** – access / refresh token signing and verification
- **bcrypt** – password hashing
- **Pydantic v2** – request/response validation and settings
- **Uvicorn** – ASGI server

## Getting started

Requires Python 3.11+.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# optional: copy and tweak environment variables
cp .env.example .env

uvicorn app.main:app --reload --port 8000
```

The API runs at `http://localhost:8000`. Interactive docs are available at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### With Docker

```bash
cd backend
docker build -t product-rbac-api .
docker run -p 8000:8000 product-rbac-api
```

Pass configuration with `-e`, e.g. `docker run -p 8000:8000 -e CORS_ORIGINS=http://localhost:3000 product-rbac-api`.

## Demo accounts

All accounts share the password **`password123`**.

| Email                | Role   | Permissions                       |
| -------------------- | ------ | --------------------------------- |
| admin@example.com    | admin  | read, create, update, delete      |
| editor@example.com   | editor | read, update                      |
| viewer@example.com   | viewer | read                              |

## Roles & permissions

Roles map to a fixed set of permissions in [`app/rbac.py`](app/rbac.py). This is
the single source of truth on the server; the frontend keeps a copy only to hide
controls a user can't use.

| Permission       | Admin | Editor | Viewer |
| ---------------- | :---: | :----: | :----: |
| `product:read`   |  ✅   |   ✅   |   ✅   |
| `product:create` |  ✅   |   ❌   |   ❌   |
| `product:update` |  ✅   |   ✅   |   ❌   |
| `product:delete` |  ✅   |   ❌   |   ❌   |

Every product endpoint depends on `require_permission(...)`. A valid token with
the wrong role returns **403**; a missing/expired token returns **401**.

## API reference

### Auth

| Method | Path            | Auth | Description                                            |
| ------ | --------------- | ---- | ------------------------------------------------------ |
| POST   | `/auth/login`   | –    | Exchange email + password for an access/refresh token. |
| POST   | `/auth/refresh` | –    | Exchange a refresh token for a new access token.       |
| GET    | `/auth/me`      | ✅   | Return the current user and their permissions.         |

`POST /auth/login`

```json
// request
{ "email": "admin@example.com", "password": "password123" }

// response
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "email": "admin@example.com",
    "name": "Aarav Sharma",
    "role": "admin",
    "permissions": ["product:create", "product:delete", "product:read", "product:update"]
  }
}
```

### Products

All product routes require a `Authorization: Bearer <access_token>` header.

| Method | Path                   | Permission       | Description                          |
| ------ | ---------------------- | ---------------- | ------------------------------------ |
| GET    | `/products`            | `product:read`   | Paginated, filterable list.          |
| GET    | `/products/{id}`       | `product:read`   | Single product.                      |
| POST   | `/products`            | `product:create` | Create a product.                    |
| PUT    | `/products/{id}`       | `product:update` | Update a product (partial allowed).  |
| DELETE | `/products/{id}`       | `product:delete` | Delete a product.                    |
| GET    | `/products/categories` | `product:read`   | Distinct categories in the store.    |

`GET /products` query parameters: `search`, `category`, `status`
(`active` \| `inactive`), `page` (default 1),
`page_size` (default 10, max 100). It returns:

> A product is considered **out of stock** when `stock` is `0`. That's derived
> from the quantity rather than stored as a status, so the two can never disagree.

```json
{ "items": [ /* Product[] */ ], "total": 8, "page": 1, "page_size": 10 }
```

## Configuration

Set via environment variables (see [`.env.example`](.env.example)):

| Variable                   | Default                  | Description                          |
| -------------------------- | ------------------------ | ------------------------------------ |
| `JWT_SECRET`               | `dev-secret-...`         | HMAC secret for signing tokens.      |
| `ACCESS_TOKEN_TTL_MINUTES` | `30`                     | Access token lifetime.               |
| `REFRESH_TOKEN_TTL_DAYS`   | `7`                      | Refresh token lifetime.              |
| `CORS_ORIGINS`             | `http://localhost:3000`  | Comma-separated allowed origins.     |

## Notes & limitations

- **Storage is in-memory** ([`app/store.py`](app/store.py)). Data is seeded on
  startup and resets when the process restarts. Swapping in a real database only
  touches that module.
- Users are hardcoded with a shared demo password — intended for evaluation, not
  production. Real deployments would back this with a user table and per-user
  hashes (the lookup shape stays the same).
- Tokens are stateless JWTs; there is no server-side revocation list.
