from datetime import datetime
from enum import Enum

from pydantic import BaseModel, EmailStr, Field

from .rbac import Role


class ProductStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


# ----- auth -----

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class RefreshRequest(BaseModel):
    refresh_token: str


class PublicUser(BaseModel):
    email: EmailStr
    name: str
    role: Role
    permissions: list[str]


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: PublicUser


class AccessToken(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ----- products -----

class ProductInput(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(default="", max_length=2000)
    price: float = Field(ge=0, le=1_000_000)
    stock: int = Field(default=0, ge=0, le=1_000_000)
    category: str = Field(min_length=1, max_length=60)
    status: ProductStatus = ProductStatus.ACTIVE


class ProductPatch(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=2000)
    price: float | None = Field(default=None, ge=0, le=1_000_000)
    stock: int | None = Field(default=None, ge=0, le=1_000_000)
    category: str | None = Field(default=None, min_length=1, max_length=60)
    status: ProductStatus | None = None


class Product(ProductInput):
    id: str
    created_at: datetime
    updated_at: datetime


class ProductPage(BaseModel):
    items: list[Product]
    total: int
    page: int
    page_size: int


class ProductStats(BaseModel):
    total: int
    active: int
    inactive: int
    out_of_stock: int
    low_stock: int
    total_units: int
    inventory_value: float
