from sqlalchemy.orm import Session

from app.models.models import (
    Order,
    OrderItem,
    Product,
    User,
    ProductStatistic,
)

from app.schemas.schemas import OrderCreate

from app.crud import crud_delivery


def create_order(
    db: Session,
    order_in: OrderCreate,
    current_user: User = None,
) -> Order:
    """
    Crée une commande (cliente connectée OU invitée).

    Le panier est géré côté frontend (localStorage).

    Le prix des produits est recalculé à partir du prix réel
    enregistré en base de données.

    Le prix de livraison est également calculé côté backend
    à partir de la Wilaya et du type de livraison.

    Le frontend ne fournit jamais le prix de livraison.
    """

    # =========================================================
    # 1. Récupérer le tarif de livraison
    # =========================================================

    delivery_price = crud_delivery.get_delivery_price_by_wilaya(
        db=db,
        wilaya=order_in.wilaya,
    )

    if not delivery_price:
        raise ValueError(
            f"Aucun tarif de livraison n'est configuré "
            f"pour la wilaya {order_in.wilaya}."
        )

    # Choisir le tarif selon le type de livraison
    if order_in.delivery_type == "domicile":
        delivery_fee = delivery_price.home_price
    else:
        delivery_fee = delivery_price.office_price

    # =========================================================
    # 2. Valider les articles et calculer le sous-total
    # =========================================================

    subtotal = 0.0
    order_items_data = []

    for item in order_in.items:

        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )

        if not product or not product.is_active:
            raise ValueError(
                f"Le produit avec l'ID {item.product_id} est introuvable."
            )

        if not product.is_available:
            raise ValueError(
                f"Le produit '{product.title}' est actuellement "
                f"en rupture de stock."
            )

        if product.stock < item.quantity:
            raise ValueError(
                f"Stock insuffisant pour le produit : {product.title}"
            )

        # Prix réel provenant de la base
        item_total = product.price * item.quantity
        subtotal += item_total

        order_items_data.append(
            {
                "product_id": product.id,
                "quantity": item.quantity,
                "price_at_purchase": product.price,
                "selected_size": item.selected_size,
                "selected_color": item.selected_color,
            }
        )

    # =========================================================
    # 3. Calculer le total final
    # =========================================================

    total_price = subtotal + delivery_fee

    # =========================================================
    # 4. Réduire le stock
    # =========================================================

    for item in order_in.items:

        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )

        product.stock -= item.quantity

        if product.stock == 0:
            product.is_available = False

    # =========================================================
    # 5. Créer la commande
    # =========================================================

    db_order = Order(
        user_id=current_user.id if current_user else None,
        status="pending",

        # Total produits + livraison
        total_price=total_price,

        # Tarif de livraison sauvegardé au moment de la commande
        delivery_fee=delivery_fee,

        customer_name=order_in.customer_name,
        phone=order_in.phone,
        wilaya=order_in.wilaya,
        commune=order_in.commune,
        delivery_type=order_in.delivery_type,
        address=order_in.address,
        office_name=order_in.office_name,
        payment_method="cod",
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # =========================================================
    # 6. Créer les OrderItems + statistiques
    # =========================================================

    for item_data in order_items_data:

        db_item = OrderItem(
            order_id=db_order.id,
            **item_data,
        )

        db.add(db_item)

        stat = (
            db.query(ProductStatistic)
            .filter(
                ProductStatistic.product_id
                == item_data["product_id"]
            )
            .first()
        )

        if stat:
            stat.sales_count += item_data["quantity"]

            stat.total_revenue += (
                item_data["quantity"]
                * item_data["price_at_purchase"]
            )

            if stat.views_count > 0:
                stat.conversion_rate = (
                    stat.sales_count / stat.views_count
                )

    db.commit()
    db.refresh(db_order)

    return db_order


def get_user_orders(db: Session, user_id: int):
    """Récupère toutes les commandes d'une cliente connectée."""

    return (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .all()
    )


def get_all_orders(
    db: Session,
    skip: int = 0,
    limit: int = 100,
):
    """Récupère l'ensemble des commandes de la boutique (Réservé Admin)."""

    return (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_order_by_id(
    db: Session,
    order_id: int,
):
    """Récupère le détail d'une commande spécifique (Réservé Admin)."""

    return (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )


def delete_order(
    db: Session,
    order_id: int,
) -> bool:
    """Supprime une commande et ses lignes associées (Réservé Admin)."""

    db_order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not db_order:
        return False

    db.delete(db_order)
    db.commit()

    return True


def update_order_status(
    db: Session,
    order_id: int,
    new_status: str,
):
    """
    Met à jour le statut d'une commande
    (pending, confirmed, shipped, delivered, returned, cancelled).
    """

    db_order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not db_order:
        return None

    db_order.status = new_status

    db.commit()
    db.refresh(db_order)

    return db_order