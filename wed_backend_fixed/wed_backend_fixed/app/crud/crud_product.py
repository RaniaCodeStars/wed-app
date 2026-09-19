# backend/app/crud/crud_product.py

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import Product, Category, ProductStatistic
from app.schemas.schemas import ProductUpdate, CategoryCreate

# --- CATEGORIES ---

def get_categories(
    db: Session,
    include_inactive: bool = False,
):
    query = db.query(Category)

    if not include_inactive:
        query = query.filter(Category.is_active == True)  # noqa: E712

    return query.all()

def create_category(db: Session, category_in: CategoryCreate):
    slug_value = category_in.slug if category_in.slug else category_in.name.lower().replace(" ", "-")

    db_category = Category(
        name=category_in.name,
        slug=slug_value
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def archive_category(db: Session, category_id: int):
    category = (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )

    if not category:
        return None

    category.is_active = False

    db.commit()
    db.refresh(category)

    return category

def restore_category(db: Session, category_id: int):
    category = (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )

    if not category:
        return None

    category.is_active = True

    db.commit()
    db.refresh(category)

    return category
# --- PRODUITS ---

def get_products(db: Session, skip: int = 0, limit: int = 100, category_id: Optional[int] = None, include_inactive: bool = False):
    query = db.query(Product)
    if not include_inactive:
        query = query.filter(Product.is_active == True)  # noqa: E712
    if category_id is not None:
        query = query.filter(Product.category_id == category_id)
    return query.offset(skip).limit(limit).all()


def get_product_by_id(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()


def create_product_with_files(
    db: Session,
    title: str,
    description: Optional[str],
    price: float,
    stock: int,
    category_id: int,
    badge: Optional[str],
    sizes: Optional[str],
    colors: Optional[str],
    image_paths: List[str],
) -> Product:

    db_product = Product(
        title=title,
        description=description,
        price=price,
        stock=stock,
        category_id=category_id,
        badge=badge,
        sizes=sizes,
        colors=colors,
        image_principale=image_paths[0] if image_paths else None,
        images=image_paths or [],
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    db_stat = ProductStatistic(product_id=db_product.id)
    db.add(db_stat)
    db.commit()
    db.refresh(db_product)

    return db_product


def update_product(db: Session, product_id: int, product_in: ProductUpdate):
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return None

    update_data = product_in.model_dump(exclude_unset=True)

    # Si une nouvelle galerie est fournie sans image principale explicite,
    # on garde la premiere image de la galerie comme image principale.
    if "images" in update_data and update_data["images"] and not update_data.get("image_principale"):
        update_data["image_principale"] = update_data["images"][0]

    for key, value in update_data.items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    return db_product


def add_product_images(db: Session, product_id: int, new_image_paths: List[str]):
    """Ajoute des images supplementaires a un produit existant (upload de fichiers)."""
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return None

    existing_images = list(db_product.images or [])
    existing_images.extend(new_image_paths)
    db_product.images = existing_images

    if not db_product.image_principale and existing_images:
        db_product.image_principale = existing_images[0]

    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    """Soft-delete un produit."""

    db_product = get_product_by_id(db, product_id)

    if not db_product:
        return None

    print("🔴 DELETE PRODUCT - trouvé :", db_product.id)

    db_product.is_active = False
    db_product.is_available = False

    print("🟡 Avant commit")

    try:
        db.commit()
        print("🟢 Commit OK")
    except Exception as e:
        db.rollback()
        print("❌ ERREUR COMMIT :", repr(e))
        raise

    try:
        db.refresh(db_product)
        print("🟢 Refresh OK")
    except Exception as e:
        print("❌ ERREUR REFRESH :", repr(e))
        raise

    return db_product

def set_product_availability(db: Session, product_id: int, is_available: bool):
    """Toggle switch rapide 'rupture de stock' (indépendant du compteur de stock)."""
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return None
    db_product.is_available = is_available
    db.commit()
    db.refresh(db_product)
    return db_product
