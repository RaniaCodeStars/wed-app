# backend/app/schemas/schemas.py

import re
from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional, List, Literal
from datetime import datetime

from app.core.wilayas import VALID_WILAYA_NAMES

PHONE_REGEX = re.compile(r"^0[567]\d{8}$")  # 10 chiffres, commence par 05, 06 ou 07

OrderStatusLiteral = Literal["pending", "confirmed", "shipped", "delivered", "returned", "cancelled"]
DeliveryTypeLiteral = Literal["domicile", "bureau"]


def _validate_phone(v: str) -> str:
    v = v.strip().replace(" ", "")
    if not PHONE_REGEX.match(v):
        raise ValueError("Numéro de téléphone invalide : 10 chiffres, doit commencer par 05, 06 ou 07.")
    return v


def _validate_wilaya(v: str) -> str:
    if v not in VALID_WILAYA_NAMES:
        raise ValueError(f"Wilaya invalide : '{v}' ne fait pas partie des 58 wilayas d'Algérie.")
    return v


# ==================== 1. AUTH & USERS ====================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    phone: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        return _validate_phone(v) if v else v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    is_active: bool
    is_admin: bool
    role: Optional[str] = None
    phone: Optional[str] = None
    wilaya: Optional[str] = None
    address: Optional[str] = None
    badge: Optional[str] = None
    internal_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserAdminUpdate(BaseModel):
    """Utilisé par l'admin pour mettre à jour la fiche d'une cliente."""
    badge: Optional[str] = None
    internal_notes: Optional[str] = None
    is_active: Optional[bool] = None
    phone: Optional[str] = None
    wilaya: Optional[str] = None
    address: Optional[str] = None
    role: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str


# ==================== 2. CATEGORIES ====================

class CategoryCreate(BaseModel):
    name: str
    slug: Optional[str] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True


# ==================== 3. SIZES ====================

class SizeGroupCreate(BaseModel):
    name: str
    sizes_list: str  # Ex: "S,M,L,XL"


class SizeGroupResponse(BaseModel):
    id: int
    name: str
    sizes_list: str

    class Config:
        from_attributes = True


# ==================== 4. WILAYAS ====================

class WilayaResponse(BaseModel):
    code: str
    name_fr: str
    name_ar: str


# ==================== 5. PRODUCT STATISTICS ====================

class ProductStatisticResponse(BaseModel):
    id: int
    product_id: int
    views_count: int
    sales_count: int
    total_revenue: float
    conversion_rate: float
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== 6. PRODUCTS ====================
# NOTE: le modèle Product stocke les images dans deux colonnes JSON :
#   - image_principale : l'URL de l'image principale (string)
#   - images           : la liste des URLs de la galerie (list[string])
# L'upload de fichiers se fait via multipart/form-data directement dans la
# route (voir admin/products.py) : ce schéma sert pour les réponses et pour
# les mises à jour "texte" (JSON) des produits.

class ProductCreate(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    sizes: Optional[str] = None
    colors: Optional[str] = None
    category_id: int
    badge: Optional[str] = None


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    image_principale: Optional[str] = None
    images: Optional[List[str]] = None
    sizes: Optional[str] = None
    colors: Optional[str] = None
    category_id: Optional[int] = None
    badge: Optional[str] = None
    is_available: Optional[bool] = None


class ProductAvailabilityUpdate(BaseModel):
    """Utilisé par le toggle switch rapide 'rupture de stock' depuis la liste des produits."""
    is_available: bool


class ProductResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    price: float
    stock: int
    image_principale: Optional[str] = None
    images: Optional[List[str]] = None
    sizes: Optional[str] = None
    colors: Optional[str] = None
    badge: Optional[str] = None
    is_active: bool
    is_available: bool
    created_at: Optional[datetime] = None
    category: Optional[CategoryResponse] = None
    statistics: Optional[ProductStatisticResponse] = None

    class Config:
        from_attributes = True


# ==================== 7. REVIEWS (COMMENTAIRES) ====================

class ReviewCreate(BaseModel):
    product_id: int
    rating: int  # 1 à 5
    text: str
    customer_name: str

    @field_validator("rating")
    @classmethod
    def validate_rating(cls, v):
        if not (1 <= v <= 5):
            raise ValueError("La note doit être comprise entre 1 et 5.")
        return v


class ReviewStatusUpdate(BaseModel):
    status: Literal["pending", "approved"]


class ReviewResponse(BaseModel):
    id: int
    product_id: int
    user_id: int
    customer_name: str
    rating: int
    text: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== 8. ORDERS & ORDER ITEMS ====================

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    selected_size: Optional[str] = None
    selected_color: Optional[str] = None

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, v):
        if v < 1:
            raise ValueError("La quantité doit être d'au moins 1.")
        return v


class DeliveryInfoBase(BaseModel):
    """Champs communs de livraison, partagés par la commande directe et le futur checkout."""
    customer_name: str
    phone: str
    wilaya: str
    commune: str
    delivery_type: DeliveryTypeLiteral
    address: Optional[str] = None      # requis si delivery_type == "domicile"
    office_name: Optional[str] = None  # requis si delivery_type == "bureau"

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        return _validate_phone(v)

    @field_validator("wilaya")
    @classmethod
    def validate_wilaya(cls, v):
        return _validate_wilaya(v)

    @model_validator(mode="after")
    def check_delivery_fields(self):
        if self.delivery_type == "domicile" and not (self.address and self.address.strip()):
            raise ValueError("L'adresse est requise pour une livraison à domicile.")
        if self.delivery_type == "bureau" and not (self.office_name and self.office_name.strip()):
            raise ValueError("Le nom du bureau / point relais est requis pour une livraison au bureau.")
        return self


class OrderCreate(DeliveryInfoBase):
    items: List[OrderItemCreate]

    @field_validator("items")
    @classmethod
    def validate_items(cls, v):
        if not v:
            raise ValueError("La commande doit contenir au moins un article.")
        return v


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price_at_purchase: float
    selected_size: Optional[str] = None
    selected_color: Optional[str] = None
    product: Optional[ProductResponse] = None

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    status: str
    total_price: float
    delivery_fee: float
    created_at: datetime
    customer_name: str
    phone: str
    wilaya: str
    commune: str
    delivery_type: str
    address: Optional[str] = None
    office_name: Optional[str] = None
    payment_method: str
    items: List[OrderItemResponse]
    

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    status: OrderStatusLiteral


# ==================== 9. ADMIN DASHBOARD ====================

class TopProductStat(BaseModel):
    product_id: int
    title: str
    sales_count: int
    total_revenue: float


class DashboardStatsResponse(BaseModel):
    total_revenue: float
    orders_today: int
    pending_orders: int
    total_orders: int
    top_products: List[TopProductStat]


# ==================== 10. LANDING PAGE CONFIG ====================

class LandingPageConfigUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    extra_data: Optional[str] = None


class LandingPageConfigResponse(BaseModel):
    id: int
    section_key: str
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    extra_data: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True


class LandingContentCreate(BaseModel):
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_image: Optional[str] = None
    announcement_bar: Optional[str] = None


class LandingContentUpdate(BaseModel):
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_image: Optional[str] = None
    announcement_bar: Optional[str] = None


class LandingContentResponse(BaseModel):
    id: int
    hero_title: str
    hero_subtitle: str
    hero_image: str
    announcement_bar: str

    class Config:
        from_attributes = True


class DeliveryPriceCreate(BaseModel):
    wilaya: str
    home_price: float
    office_price: float

    @field_validator("home_price", "office_price")
    @classmethod
    def validate_price(cls, v):
        if v < 0:
            raise ValueError("Le prix de livraison ne peut pas être négatif.")
        return v


class DeliveryPriceUpdate(BaseModel):
    wilaya: str
    home_price: float
    office_price: float

    @field_validator("home_price", "office_price")
    @classmethod
    def validate_price(cls, v):
        if v < 0:
            raise ValueError("Le prix de livraison ne peut pas être négatif.")
        return v


class DeliveryPriceResponse(BaseModel):
    id: int
    wilaya: str
    home_price: float
    office_price: float

    class Config:
        from_attributes = True