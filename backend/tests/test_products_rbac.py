def sample_product(**overrides) -> dict:
    return {
        "name": "Test Product",
        "description": "A product used in tests.",
        "price": 19.99,
        "stock": 10,
        "category": "Electronics",
        "status": "active",
        **overrides,
    }


def test_listing_requires_authentication(client):
    assert client.get("/products").status_code in (401, 403)


def test_anyone_authenticated_can_read(client, viewer):
    res = client.get("/products", headers=viewer)
    assert res.status_code == 200
    body = res.json()
    assert {"items", "total", "page", "page_size"} <= body.keys()
    assert body["total"] >= 1


def test_admin_can_create(client, admin):
    res = client.post("/products", json=sample_product(name="Admin Widget"), headers=admin)
    assert res.status_code == 201
    created = res.json()
    assert created["id"]
    assert created["stock"] == 10


def test_viewer_cannot_create(client, viewer):
    res = client.post("/products", json=sample_product(), headers=viewer)
    assert res.status_code == 403


def test_editor_cannot_create(client, editor):
    res = client.post("/products", json=sample_product(), headers=editor)
    assert res.status_code == 403


def test_editor_can_update(client, admin, editor):
    created = client.post(
        "/products", json=sample_product(name="Editable"), headers=admin
    ).json()
    res = client.put(
        f"/products/{created['id']}", json={"price": 5.0}, headers=editor
    )
    assert res.status_code == 200
    assert res.json()["price"] == 5.0


def test_editor_cannot_delete(client, admin, editor):
    created = client.post(
        "/products", json=sample_product(name="Protected"), headers=admin
    ).json()
    res = client.delete(f"/products/{created['id']}", headers=editor)
    assert res.status_code == 403


def test_admin_can_delete(client, admin):
    created = client.post(
        "/products", json=sample_product(name="Disposable"), headers=admin
    ).json()
    res = client.delete(f"/products/{created['id']}", headers=admin)
    assert res.status_code == 204
    assert client.get(f"/products/{created['id']}", headers=admin).status_code == 404


def test_create_validates_input(client, admin):
    # Negative price should fail validation.
    res = client.post("/products", json=sample_product(price=-1), headers=admin)
    assert res.status_code == 422


def test_search_filter(client, admin):
    client.post(
        "/products", json=sample_product(name="Zphyr Unique Gadget"), headers=admin
    )
    res = client.get("/products", params={"search": "Zphyr Unique"}, headers=admin)
    assert res.status_code == 200
    names = [p["name"] for p in res.json()["items"]]
    assert any("Zphyr Unique" in n for n in names)
