# backend/app/api/v1/endpoints/admin/products.py

import os
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.models.models import User, Category, ProductStatistic
from app.crud import crud_product
from app.schemas.schemas import (
    ProductUpdate,
    ProductResponse,
    ProductAvailabilityUpdate,
    CategoryCreate,
    CategoryResponse,
    ProductStatisticResponse,
)
from app.core.deps import get_current_admin_user

router = APIRouter(prefix="/admin/products", tags=["Admin - Products"])

# Dossier local ou sont stockees les images produits (servi via StaticFiles /uploads, voir main.py)
PRODUCTS_UPLOAD_DIR = os.path.join(settings.UPLOAD_DIR, "products")
os.makedirs(PRODUCTS_UPLOAD_DIR, exist_ok=True)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"}


def _save_uploaded_images(images: List[UploadFile]) -> List[str]:
    """Sauvegarde les fichiers uploades sur le disque et retourne leurs URLs
    publiques (accessibles via /uploads/products/<fichier>)."""
    saved_urls: List[str] = []

    for image in images:
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Type de fichier non supporte : {image.content_type}. "
                       f"Formats acceptes : jpg, png, webp, gif.",
            )

        file_extension = os.path.splitext(image.filename or "")[1] or ".jpg"
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        destination_path = os.path.join(PRODUCTS_UPLOAD_DIR, unique_filename)

        with open(destination_path, "wb") as f:
            f.write(image.file.read())

        saved_urls.append(f"/uploads/products/{unique_filename}")

    return saved_urls

@router.put("/rr", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    price: float = Form(...),
    stock: int = Form(...),
    category_id: int = Form(...),
    badge: Optional[str] = Form(None),
    sizes: Optional[str] = Form(None),
    colors: Optional[str] = Form(None),
    images: List[UploadFile] = File(default=[]),
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Ajoute un nouveau produit avec ses images (stockees localement sur le serveur)."""

    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Categorie introuvable.",
        )

    image_urls = _save_uploaded_images(images) if images else []

    return crud_product.create_product_with_files(
        db=db,
        title=title,
        description=description,
        price=price,
        stock=stock,
        category_id=category_id,
        badge=badge,
        sizes=sizes,
        colors=colors,
        image_paths=image_urls,
    )


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    price: float = Form(...),
    stock: int = Form(...),
    category_id: int = Form(...),
    badge: Optional[str] = Form(None),
    sizes: Optional[str] = Form(None),
    colors: Optional[str] = Form(None),
    images: List[UploadFile] = File(default=[]),
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Ajoute un nouveau produit avec ses images (stockees localement sur le serveur)."""

    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Categorie introuvable.",
        )

    image_urls = _save_uploaded_images(images) if images else []

    return crud_product.create_product_with_files(
        db=db,
        title=title,
        description=description,
        price=price,
        stock=stock,
        category_id=category_id,
        badge=badge,
        sizes=sizes,
        colors=colors,
        image_paths=image_urls,
    )


@router.post("/{product_id}/images", response_model=ProductResponse)
def add_product_images(
    product_id: int,
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Ajoute des images supplementaires a un produit deja existant."""
    image_urls = _save_uploaded_images(images)
    updated_product = crud_product.add_product_images(db=db, product_id=product_id, new_image_paths=image_urls)
    if not updated_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable.")
    return updated_product


@router.get("/", response_model=List[ProductResponse])
def get_all_products(
    skip: int = 0,
    limit: int = 100,
    include_inactive: bool = False,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Récupère la liste de tous les produits, y compris ceux soft-deleted par défaut (Réservé Admin)."""
    return crud_product.get_products(db=db, skip=skip, limit=limit, include_inactive=include_inactive)


@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(
    include_inactive: bool = False,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    return crud_product.get_categories(
        db=db,
        include_inactive=include_inactive,
    )

@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Cree une nouvelle categorie de produits (Reserve a l'Admin)."""
    return crud_product.create_category(db=db, category_in=category_in)



@router.patch(
    "/categories/{category_id}/archive",
    response_model=CategoryResponse,
)
def archive_category(
    category_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Archive une catégorie sans la supprimer de la base de données."""
    category = crud_product.archive_category(
        db=db,
        category_id=category_id,
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Catégorie introuvable.",
        )

    return category


@router.patch(
    "/categories/{category_id}/restore",
    response_model=CategoryResponse,
)
def restore_category(
    category_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Restaure une catégorie archivée."""
    category = crud_product.restore_category(
        db=db,
        category_id=category_id,
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Catégorie introuvable.",
        )

    return category

@router.get("/{product_id}/statistics", response_model=ProductStatisticResponse)
def get_product_statistics(
    product_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Recupere les statistiques detaillees d'un produit."""
    product = crud_product.get_product_by_id(db=db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable.")

    stats = db.query(ProductStatistic).filter(ProductStatistic.product_id == product_id).first()
    if not stats:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Statistiques introuvables pour ce produit.")
    return stats


@router.get("/{product_id}", response_model=ProductResponse)
def get_admin_product_by_id(
    product_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Recupere un produit specifique par son ID pour l'administration."""
    product = crud_product.get_product_by_id(db=db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable.")
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Modifie un produit existant (Reserve a l'Admin)."""
    updated_product = crud_product.update_product(db=db, product_id=product_id, product_in=product_in)
    if not updated_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable.")
    return updated_product


@router.patch("/{product_id}/availability", response_model=ProductResponse)
def toggle_product_availability(
    product_id: int,
    availability_in: ProductAvailabilityUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Interrupteur rapide 'rupture de stock' (غير متوفر), sans ouvrir le formulaire complet."""
    updated_product = crud_product.set_product_availability(db=db, product_id=product_id, is_available=availability_in.is_available)
    if not updated_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable.")
    return updated_product


@router.delete("/{product_id}", response_model=ProductResponse)
def delete_product(

    product_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Supprime (soft-delete) un produit du catalogue : il disparaît du site mais reste lié
    aux anciennes commandes pour préserver l'historique (Réservé Admin)."""
    deleted = crud_product.delete_product(db=db, product_id=product_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable.")
    return deleted




@router.patch("/{product_id}/restore", response_model=ProductResponse)
def restore_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    product = crud_product.get_product_by_id(db=db, product_id=product_id)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produit introuvable."
        )

    product.is_active = True
    db.commit()
    db.refresh(product)

    return product
