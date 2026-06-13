from fastapi import APIRouter, Depends, HTTPException, Query, status

from .deps import require_permission
from .rbac import Permission
from .schemas import Product, ProductInput, ProductPage, ProductPatch, ProductStatus
from .store import store

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=ProductPage)
def list_products(
    search: str | None = Query(default=None, description="Match against name or description"),
    category: str | None = None,
    status: ProductStatus | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    _=Depends(require_permission(Permission.READ)),
) -> ProductPage:
    items, total = store.list(
        search=search,
        category=category,
        status=status,
        page=page,
        page_size=page_size,
    )
    return ProductPage(items=items, total=total, page=page, page_size=page_size)


@router.get("/categories", response_model=list[str])
def list_categories(_=Depends(require_permission(Permission.READ))) -> list[str]:
    return store.categories()


@router.get("/{product_id}", response_model=Product)
def get_product(
    product_id: str,
    _=Depends(require_permission(Permission.READ)),
) -> Product:
    product = store.get(product_id)
    if product is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
    return product


@router.post("", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(
    body: ProductInput,
    _=Depends(require_permission(Permission.CREATE)),
) -> Product:
    return store.create(body)


@router.put("/{product_id}", response_model=Product)
def update_product(
    product_id: str,
    body: ProductPatch,
    _=Depends(require_permission(Permission.UPDATE)),
) -> Product:
    product = store.update(product_id, body)
    if product is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: str,
    _=Depends(require_permission(Permission.DELETE)),
) -> None:
    if not store.delete(product_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
