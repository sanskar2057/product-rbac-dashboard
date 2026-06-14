def test_stats_requires_auth(client):
    assert client.get("/products/stats").status_code in (401, 403)


def test_stats_returns_expected_shape(client, viewer):
    res = client.get("/products/stats", headers=viewer)
    assert res.status_code == 200
    body = res.json()
    expected = {
        "total",
        "active",
        "inactive",
        "out_of_stock",
        "low_stock",
        "total_units",
        "inventory_value",
    }
    assert expected <= body.keys()
    assert body["total"] >= 1
    assert body["active"] + body["inactive"] == body["total"]


def test_stats_reflects_changes(client, admin):
    before = client.get("/products/stats", headers=admin).json()
    client.post(
        "/products",
        json={
            "name": "Stats Probe",
            "price": 10,
            "stock": 0,
            "category": "Other",
            "status": "active",
        },
        headers=admin,
    )
    after = client.get("/products/stats", headers=admin).json()
    assert after["total"] == before["total"] + 1
    assert after["out_of_stock"] == before["out_of_stock"] + 1
