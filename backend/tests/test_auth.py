from tests.conftest import login


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_login_returns_tokens_and_permissions(client):
    data = login(client, "admin@example.com")
    assert data["token_type"] == "bearer"
    assert data["access_token"] and data["refresh_token"]
    assert data["user"]["role"] == "admin"
    assert "product:delete" in data["user"]["permissions"]


def test_login_rejects_bad_password(client):
    res = client.post(
        "/auth/login",
        json={"email": "admin@example.com", "password": "nope"},
    )
    assert res.status_code == 401


def test_login_rejects_unknown_user(client):
    res = client.post(
        "/auth/login",
        json={"email": "ghost@example.com", "password": "password123"},
    )
    assert res.status_code == 401


def test_me_requires_token(client):
    assert client.get("/auth/me").status_code in (401, 403)


def test_me_returns_current_user(client, viewer):
    res = client.get("/auth/me", headers=viewer)
    assert res.status_code == 200
    assert res.json()["role"] == "viewer"


def test_refresh_issues_new_access_token(client):
    refresh_token = login(client, "editor@example.com")["refresh_token"]
    res = client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert res.status_code == 200
    assert res.json()["access_token"]


def test_refresh_rejects_access_token(client):
    access_token = login(client, "editor@example.com")["access_token"]
    # An access token must not be usable as a refresh token.
    res = client.post("/auth/refresh", json={"refresh_token": access_token})
    assert res.status_code == 401
