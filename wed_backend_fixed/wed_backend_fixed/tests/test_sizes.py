# backend/tests/test_sizes.py

from app.core.deps import get_current_admin_user


def test_create_and_get_size_group(client, db, test_admin):
    # Mock l'authentification admin
    app = client.app
    app.dependency_overrides[get_current_admin_user] = lambda: test_admin

    # Test de création d'un groupe de tailles
    response = client.post("/api/v1/sizes/", json={
        "name": "Standard Lingerie",
        "sizes_list": "85A,90B,95C"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Standard Lingerie"
    assert data["sizes_list"] == "85A,90B,95C"

    # Test de récupération de la liste des tailles (public)
    response_get = client.get("/api/v1/sizes/")
    assert response_get.status_code == 200
    assert len(response_get.json()) == 1
