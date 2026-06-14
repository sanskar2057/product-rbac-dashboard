"""In-memory user directory.

These are demo accounts with a shared password. In a real system this would be a
database with per-user salted hashes; the shape of the lookup stays the same.
"""

from dataclasses import dataclass

from .rbac import Role
from .security import hash_password

DEMO_PASSWORD = "password123"


@dataclass
class User:
    email: str
    name: str
    role: Role
    password_hash: str


_SEED = [
    ("admin@example.com", "Sanskar Dhungana", Role.ADMIN),
    ("editor@example.com", "Editor User", Role.EDITOR),
    ("viewer@example.com", "Viewer User", Role.VIEWER),
]

_users: dict[str, User] = {
    email: User(email=email, name=name, role=role, password_hash=hash_password(DEMO_PASSWORD))
    for email, name, role in _SEED
}


def get_user(email: str) -> User | None:
    return _users.get(email.strip().lower())
