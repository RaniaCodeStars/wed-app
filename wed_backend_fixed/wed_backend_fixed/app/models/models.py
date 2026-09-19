# backend/app/models/models.py

from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)  # True = Admin, False = Client
    # Sous-role optionnel pour les comptes admin (ex: "admin", "confirmatrice").
    # Prevu pour les futurs profils staff sans casser le systeme is_admin actuel.
    role = Column(String, nullable=True)

    # Informations enrichies pour le suivi client (Fiche cliente admin)
    phone = Column(String, nullable=True)
    wilaya = Column(String, nullable=True)
    address = Column(String, nullable=True)
    badge = Column(String, nullable=True)          # Ex: "زبونة مميزة ✦"
    internal_notes = Column(Text, nullable=True)   # Notes privées de l'admin sur la cliente

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relations
    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # Ex: "بيجامات", "لانجيري"
    slug = Column(String, unique=True, nullable=True)   # URL propre
    is_active = Column(Boolean, default=True, nullable=False)
    # Relation : Une catégorie contient plusieurs produits
    products = relationship("Product", back_populates="category")


class SizeGroup(Base):
    __tablename__ = "size_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # Ex: "مجموعة الملابس (Standard)"
    sizes_list = Column(String, nullable=False)        # Ex: "S,M,L,XL" stockés sous forme de texte séparé par des virgules


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    image_principale = Column(JSON, nullable=True)      # Image principale
    images = Column(JSON, nullable=True)                # Tableau de plusieurs images (JSON)

    # Spécificités Lingerie : Tailles et Couleurs
    sizes = Column(String, nullable=True)
    colors = Column(String, nullable=True)

    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    # Badge marketing : "new", "bestseller", etc.
    badge = Column(String, nullable=True)

    # is_active = soft-delete (False = supprimé, caché de tout le monde mais garde l'historique
    #             des anciennes commandes intact).
    # is_available = interrupteur rapide "rupture de stock" (غير متوفر), independant du compteur
    #                de stock — permet a l'admin de masquer un produit sans changer la quantite.
    is_active = Column(Boolean, default=True, nullable=False)
    is_available = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relations
    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
    statistics = relationship("ProductStatistic", back_populates="product", uselist=False, cascade="all, delete-orphan")


class ProductStatistic(Base):
    __tablename__ = "product_statistics"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), unique=True, nullable=False)
    views_count = Column(Integer, default=0, nullable=False)       # Nombre de vues de la fiche produit
    sales_count = Column(Integer, default=0, nullable=False)       # Nombre d'unités vendues
    total_revenue = Column(Float, default=0.0, nullable=False)     # Chiffre d'affaires généré par ce produit
    conversion_rate = Column(Float, default=0.0, nullable=False)   # Taux de conversion (achats / vues)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relation
    product = relationship("Product", back_populates="statistics")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    customer_name = Column(String, nullable=False)  # Nom affiché de la cliente
    rating = Column(Integer, nullable=False)         # Note de 1 à 5
    text = Column(Text, nullable=False)              # Texte du commentaire
    status = Column(String, default="pending", nullable=False)  # "pending" (en attente) ou "approved" (approuvé)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relations
    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Statuts (ensemble fusionné doc + existant) :
    # "pending", "confirmed", "shipped", "delivered", "returned", "cancelled"
    status = Column(String, default="pending", nullable=False)
    total_price = Column(Float, nullable=False)
    delivery_fee = Column(Float, nullable=False, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # --- Infos de livraison (capturées au moment de la commande, même pour une invitée) ---
    customer_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    wilaya = Column(String, nullable=False)
    commune = Column(String, nullable=False)

    # "domicile" (livraison à domicile, nécessite `address`) ou
    # "bureau" (point relais / stop desk, nécessite `office_name`)
    delivery_type = Column(String, nullable=False, default="domicile")
    address = Column(String, nullable=True)      # requis si delivery_type == "domicile"
    office_name = Column(String, nullable=True)  # requis si delivery_type == "bureau"

    payment_method = Column(String, nullable=False, default="cod")  # Paiement à la livraison uniquement pour l'instant

    # Relations
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_at_purchase = Column(Float, nullable=False)  # Fige le prix au moment de l'achat

    selected_size = Column(String, nullable=True)
    selected_color = Column(String, nullable=True)

    # Relations
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class LandingPageConfig(Base):
    __tablename__ = "landing_page_config"

    id = Column(Integer, primary_key=True, index=True)
    section_key = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=True)
    subtitle = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    extra_data = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class LandingContent(Base):
    __tablename__ = "landing_content"

    id = Column(Integer, primary_key=True, index=True)
    hero_title = Column(String, default="Sublimez votre féminité")
    hero_subtitle = Column(String, default="Découvrez notre collection de lingerie d'exception")
    hero_image = Column(String, default="")
    announcement_bar = Column(String, default="✨ Livraison disponible sur 58 wilayas")
    
    
    
    
#Delivery and Payment Info
class DeliveryPrice(Base):
    __tablename__ = "delivery_prices"

    id = Column(Integer, primary_key=True, index=True)

    wilaya = Column(String, unique=True, nullable=False)

    home_price = Column(Float, nullable=False, default=0)
    office_price = Column(Float, nullable=False, default=0)
