import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="session")
def client() -> TestClient:
    return TestClient(app)


def login(client: TestClient, email: str, password: str = "password123") -> dict:
    res = client.post("/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200, res.text
    return res.json()


def auth_header(client: TestClient, email: str) -> dict:
    token = login(client, email)["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin(client):
    return auth_header(client, "admin@example.com")


@pytest.fixture
def editor(client):
    return auth_header(client, "editor@example.com")


@pytest.fixture
def viewer(client):
    return auth_header(client, "viewer@example.com")
