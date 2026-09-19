# backend/app/api/v1/endpoints/router.py

from fastapi import APIRouter

from app.api.v1.endpoints import auth, reviews, sizes, wilayas
from app.api.v1.endpoints.client import products as client_products, orders as client_orders, landing as client_landing,delivery as client_delivery
from app.api.v1.endpoints.admin import (
    products as admin_products,
    orders as admin_orders,
    landing as admin_landing,
    users as admin_users,
    dashboard as admin_dashboard,
    delivery as admin_delivery,
)

api_router = APIRouter()

# Authentification
api_router.include_router(auth.router)

# Données de référence partagées (frontend + validation backend)
api_router.include_router(wilayas.router)

# Routes Client
api_router.include_router(client_products.router)
api_router.include_router(client_orders.router)
api_router.include_router(client_delivery.router)
api_router.include_router(client_landing.router)

# Routes Admin
api_router.include_router(admin_products.router)
api_router.include_router(admin_delivery.router)
api_router.include_router(admin_orders.router)
api_router.include_router(admin_landing.router)
api_router.include_router(admin_users.router)
api_router.include_router(admin_dashboard.router)

# Routes partagées (protégées individuellement par route selon le rôle)
api_router.include_router(reviews.router)
api_router.include_router(sizes.router)
