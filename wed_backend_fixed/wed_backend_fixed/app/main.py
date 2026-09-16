# backend/app/main.py

import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.endpoints.router import api_router

# 1. Initialisation de l'application FastAPI
app = FastAPI(
    title="Wed - E-Commerce Lingerie API",
    version="1.0.0",
    description="API backend pour la plateforme e-commerce de lingerie Wed",
)

# 2. Configuration CORS (indispensable pour le frontend Next.js)
# Les origines autorisees viennent de .env (CORS_ORIGINS), ex:
# CORS_ORIGINS=http://localhost:3000,https://www.wed-lingerie.com
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Configuration du dossier statique pour les images (uploads produits, etc.)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# 4. Inclusion de TOUTES les routes de l'API sous /api/v1
#    (auth, produits, commandes, panier, avis, tailles, landing page, admin...)
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API de la boutique Wed ! 🚀", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
