# backend/app/api/v1/endpoints/client/products.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.crud import crud_product
from app.schemas.schemas import ProductResponse, CategoryResponse

router = APIRouter(prefix="/products", tags=["Client - Products"])

@router.get("/", response_model=List[ProductResponse])
def list_products(
    skip: int = 0,
    limit: int = 100,
    category_id: int = None,
    db: Session = Depends(get_db),
):
    """Affiche la liste de tous les produits de lingerie disponibles.
    Peut etre filtree par categorie via ?category_id=..."""
    products = crud_product.get_products(db, skip=skip, limit=limit, category_id=category_id)
    return products

@router.get("/categories", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    """Affiche la liste de toutes les catégories (ex: Soutiens-gorge, Culottes, Ensembles)."""
    return crud_product.get_categories(db)

@router.get("/{product_id}", response_model=ProductResponse)
def get_product_detail(product_id: int, db: Session = Depends(get_db)):
    """Affiche les détails d'un produit spécifique (tailles, couleurs, stock, prix)."""
    product = crud_product.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produit introuvable."
        )
    return product