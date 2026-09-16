# backend/tests/test_orders.py

from app.models.models import Category, Product


def test_create_order_as_guest(client, db):
    cat = Category(name="Vêtements", slug="vetements")
    db.add(cat)
    db.commit()

    prod = Product(title="Article Test", price=1500.0, stock=5, category_id=cat.id)
    db.add(prod)
    db.commit()

    # Passage de commande avec les informations du client invité (pas de compte requis)
    response = client.post("/api/v1/orders/", json={
        "customer_name": "Ranya",
        "phone": "0550000000",
        "wilaya": "Alger",
        "commune": "Chéraga",
        "delivery_type": "domicile",
        "address": "Cité 100 logements, Chéraga",
        "items": [
            {
                "product_id": prod.id,
                "quantity": 1,
                "selected_size": "M",
                "selected_color": "Noir",
            }
        ]
    })

    assert response.status_code == 201
    data = response.json()
    assert data["total_price"] == 1500.0
    # Une commande invitée n'est liée à aucun compte utilisateur
    assert data["user_id"] is None
    assert data["delivery_type"] == "domicile"


def test_create_order_bureau_requires_office_name(client, db):
    cat = Category(name="Vêtements2", slug="vetements2")
    db.add(cat)
    db.commit()
    prod = Product(title="Article Test 2", price=2000.0, stock=5, category_id=cat.id)
    db.add(prod)
    db.commit()

    # Livraison au bureau sans nom de bureau -> doit échouer la validation
    response = client.post("/api/v1/orders/", json={
        "customer_name": "Ranya",
        "phone": "0660000000",
        "wilaya": "Oran",
        "commune": "Oran Centre",
        "delivery_type": "bureau",
        "items": [
            {"product_id": prod.id, "quantity": 1}
        ]
    })
    assert response.status_code == 422


def test_get_my_orders_authenticated(client, db, test_user):
    login_res = client.post("/api/v1/auth/login", data={
        "username": "client@test.com",
        "password": "password123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/v1/orders/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
