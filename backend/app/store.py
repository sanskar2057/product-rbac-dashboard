"""Thread-safe in-memory product store.

Data lives for the lifetime of the process and is reseeded on startup. Swapping
this for a real database would only touch this module.
"""

from __future__ import annotations

from datetime import datetime, timezone
from threading import RLock
from uuid import uuid4

from .schemas import Product, ProductInput, ProductPatch, ProductStatus

# Items at or below this quantity (but not zero) count as "low stock".
LOW_STOCK_THRESHOLD = 10


def _now() -> datetime:
    return datetime.now(timezone.utc)


_SEED = [
    ("Aurora Wireless Headphones", "Over-ear ANC headphones with 30h battery life.", 189.99, 42, "Electronics", ProductStatus.ACTIVE),
    ("Trailhead Backpack 32L", "Water-resistant hiking pack with laptop sleeve.", 79.50, 18, "Outdoors", ProductStatus.ACTIVE),
    ("Ceramic Pour-Over Set", "Hand-glazed dripper with matching carafe.", 42.00, 0, "Home & Kitchen", ProductStatus.ACTIVE),
    ("Mechanical Keyboard K2", "Hot-swappable 75% board with PBT keycaps.", 119.00, 65, "Electronics", ProductStatus.ACTIVE),
    ("Organic Cotton Tee", "Pre-shrunk crew neck in heather grey.", 24.99, 120, "Apparel", ProductStatus.INACTIVE),
    ("Standing Desk Converter", "Height-adjustable riser for monitors and keyboard.", 159.00, 9, "Furniture", ProductStatus.ACTIVE),
    ("Field Notes Trio", "Three pocket notebooks, dot grid.", 12.95, 200, "Stationery", ProductStatus.ACTIVE),
    ("Cold Brew Concentrate", "Small-batch, low-acidity, 1L bottle.", 18.00, 0, "Grocery", ProductStatus.ACTIVE),
]


class ProductStore:
    def __init__(self) -> None:
        self._items: dict[str, Product] = {}
        self._lock = RLock()
        self._seed()

    def _seed(self) -> None:
        for name, description, price, stock, category, status in _SEED:
            self.create(
                ProductInput(
                    name=name,
                    description=description,
                    price=price,
                    stock=stock,
                    category=category,
                    status=status,
                )
            )

    def list(
        self,
        *,
        search: str | None = None,
        category: str | None = None,
        status: ProductStatus | None = None,
        page: int = 1,
        page_size: int = 10,
    ) -> tuple[list[Product], int]:
        with self._lock:
            items = list(self._items.values())

        if search:
            needle = search.casefold()
            items = [
                p for p in items
                if needle in p.name.casefold() or needle in p.description.casefold()
            ]
        if category:
            items = [p for p in items if p.category.casefold() == category.casefold()]
        if status:
            items = [p for p in items if p.status == status]

        items.sort(key=lambda p: p.created_at, reverse=True)

        total = len(items)
        start = (page - 1) * page_size
        return items[start:start + page_size], total

    def categories(self) -> list[str]:
        with self._lock:
            return sorted({p.category for p in self._items.values()})

    def stats(self) -> dict:
        with self._lock:
            items = list(self._items.values())

        return {
            "total": len(items),
            "active": sum(1 for p in items if p.status == ProductStatus.ACTIVE),
            "inactive": sum(1 for p in items if p.status == ProductStatus.INACTIVE),
            "out_of_stock": sum(1 for p in items if p.stock == 0),
            "low_stock": sum(1 for p in items if 0 < p.stock <= LOW_STOCK_THRESHOLD),
            "total_units": sum(p.stock for p in items),
            "inventory_value": round(sum(p.price * p.stock for p in items), 2),
        }

    def get(self, product_id: str) -> Product | None:
        with self._lock:
            return self._items.get(product_id)

    def create(self, data: ProductInput) -> Product:
        now = _now()
        product = Product(id=uuid4().hex, created_at=now, updated_at=now, **data.model_dump())
        with self._lock:
            self._items[product.id] = product
        return product

    def update(self, product_id: str, data: ProductPatch) -> Product | None:
        with self._lock:
            existing = self._items.get(product_id)
            if existing is None:
                return None
            changes = data.model_dump(exclude_unset=True)
            updated = existing.model_copy(update={**changes, "updated_at": _now()})
            self._items[product_id] = updated
            return updated

    def delete(self, product_id: str) -> bool:
        with self._lock:
            return self._items.pop(product_id, None) is not None


store = ProductStore()
