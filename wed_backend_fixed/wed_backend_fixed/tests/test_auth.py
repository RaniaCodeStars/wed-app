# backend/tests/test_auth.py

def test_register_user(client):
    response = client.post("/api/v1/auth/register", json={
        "email": "nouveauclient@test.com",
        "password": "password123"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "nouveauclient@test.com"
    assert "id" in data

def test_login_user(client, test_user):
    # FastAPI OAuth2PasswordRequestForm utilise des données de formulaire (data) et non du JSON
    response = client.post("/api/v1/auth/login", data={
        "username": "client@test.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"