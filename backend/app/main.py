from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .auth import router as auth_router
from .config import get_settings
from .products import router as products_router

settings = get_settings()

app = FastAPI(
    title="Product RBAC API",
    version="1.0.0",
    description=(
        "Backend for the Product Management Dashboard. JWT authentication with "
        "role-based access control enforced on every product route."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth_router)
app.include_router(products_router)
