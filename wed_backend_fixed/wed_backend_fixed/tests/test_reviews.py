# backend/tests/test_reviews.py

from app.core.deps import get_current_user, get_current_admin_user
from app.models.models import Category, Product


def test_create_and_moderate_review(client, db, test_user, test_admin):
    cat = Category(name="Ensembles", slug="ensembles")
    db.add(cat)
    db.commit()

    prod = Product(title="Soutien-gorge dentelle", price=2500.0, stock=10, category_id=cat.id)
    db.add(prod)
    db.commit()

    # Mock l'utilisateur classique pour créer l'avis
    client.app.dependency_overrides[get_current_user] = lambda: test_user

    response = client.post("/api/v1/reviews/", json={
        "product_id": prod.id,
        "rating": 5,
        "text": "Magnifique qualité, taille parfaitement !",
        "customer_name": "Ranya"
    })
    assert response.status_code == 201
    review_data = response.json()
    assert review_data["status"] == "pending"

    # Mock l'administrateur pour la modération (route protégée par get_current_admin_user)
    client.app.dependency_overrides[get_current_admin_user] = lambda: test_admin

    response_patch = client.patch(f"/api/v1/reviews/{review_data['id']}/status", json={
        "status": "approved"
    })
    assert response_patch.status_code == 200
    assert response_patch.json()["status"] == "approved"
