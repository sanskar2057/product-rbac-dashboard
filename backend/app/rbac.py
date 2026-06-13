"""Single source of truth for roles and what each role is allowed to do.

The frontend mirrors this map so the UI can hide actions a user can't perform,
but every product route also re-checks it server side. The UI is a convenience,
not the security boundary.
"""

from enum import Enum


class Role(str, Enum):
    ADMIN = "admin"
    EDITOR = "editor"
    VIEWER = "viewer"


class Permission(str, Enum):
    READ = "product:read"
    CREATE = "product:create"
    UPDATE = "product:update"
    DELETE = "product:delete"


ROLE_PERMISSIONS: dict[Role, set[Permission]] = {
    Role.ADMIN: {Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE},
    Role.EDITOR: {Permission.READ, Permission.UPDATE},
    Role.VIEWER: {Permission.READ},
}


def has_permission(role: Role, permission: Permission) -> bool:
    return permission in ROLE_PERMISSIONS.get(role, set())


def permissions_for(role: Role) -> list[str]:
    return sorted(p.value for p in ROLE_PERMISSIONS.get(role, set()))
