from sqlalchemy.orm import Session

from app.models.models import DeliveryPrice


def get_delivery_prices(db: Session):
    """Récupère tous les tarifs de livraison."""
    return (
        db.query(DeliveryPrice)
        .order_by(DeliveryPrice.wilaya.asc())
        .all()
    )


def get_delivery_price(db: Session, delivery_id: int):
    """Récupère un tarif de livraison par son ID."""
    return (
        db.query(DeliveryPrice)
        .filter(DeliveryPrice.id == delivery_id)
        .first()
    )


def get_delivery_price_by_wilaya(db: Session, wilaya: str):
    """Récupère le tarif correspondant à une Wilaya."""
    return (
        db.query(DeliveryPrice)
        .filter(DeliveryPrice.wilaya == wilaya)
        .first()
    )


def create_delivery_price(
    db: Session,
    wilaya: str,
    home_price: float,
    office_price: float,
):
    """Crée un nouveau tarif de livraison."""

    existing = get_delivery_price_by_wilaya(
        db=db,
        wilaya=wilaya,
    )

    if existing:
        raise ValueError(
            f"Un tarif de livraison existe déjà pour la wilaya {wilaya}."
        )

    delivery_price = DeliveryPrice(
        wilaya=wilaya,
        home_price=home_price,
        office_price=office_price,
    )

    db.add(delivery_price)
    db.commit()
    db.refresh(delivery_price)

    return delivery_price


def update_delivery_price(
    db: Session,
    delivery_id: int,
    wilaya: str,
    home_price: float,
    office_price: float,
):
    """Modifie un tarif de livraison."""

    delivery_price = get_delivery_price(
        db=db,
        delivery_id=delivery_id,
    )

    if not delivery_price:
        return None

    # Vérifier qu'une autre entrée n'utilise pas déjà cette Wilaya
    existing = (
        db.query(DeliveryPrice)
        .filter(
            DeliveryPrice.wilaya == wilaya,
            DeliveryPrice.id != delivery_id,
        )
        .first()
    )

    if existing:
        raise ValueError(
            f"Un tarif de livraison existe déjà pour la wilaya {wilaya}."
        )

    delivery_price.wilaya = wilaya
    delivery_price.home_price = home_price
    delivery_price.office_price = office_price

    db.commit()
    db.refresh(delivery_price)

    return delivery_price


def delete_delivery_price(db: Session, delivery_id: int):
    """Supprime un tarif de livraison."""

    delivery_price = get_delivery_price(
        db=db,
        delivery_id=delivery_id,
    )

    if not delivery_price:
        return False

    db.delete(delivery_price)
    db.commit()

    return True