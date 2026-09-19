from app.core.database import SessionLocal
from app.core.wilayas import WILAYAS
from app.models.models import DeliveryPrice


DEFAULT_HOME_PRICE = 500
DEFAULT_OFFICE_PRICE = 300


def seed_delivery_prices():
    db = SessionLocal()

    try:
        created_count = 0
        skipped_count = 0

        for wilaya in WILAYAS:
            code = wilaya["code"]
            name_ar = wilaya["name_ar"]

            existing = (
                db.query(DeliveryPrice)
                .filter(DeliveryPrice.wilaya == code)
                .first()
            )

            if existing:
                skipped_count += 1
                continue

            delivery_price = DeliveryPrice(
                wilaya=code,
                home_price=DEFAULT_HOME_PRICE,
                office_price=DEFAULT_OFFICE_PRICE,
            )

            db.add(delivery_price)
            created_count += 1

            print(
                f"✓ {code} - {name_ar} | "
                f"Domicile: {DEFAULT_HOME_PRICE} DA | "
                f"Bureau: {DEFAULT_OFFICE_PRICE} DA"
            )

        db.commit()

        print()
        print("=" * 60)
        print("SEED DELIVERY PRICES")
        print("=" * 60)
        print(f"Wilayas trouvées : {len(WILAYAS)}")
        print(f"Tarifs créés     : {created_count}")
        print(f"Déjà existants   : {skipped_count}")
        print("=" * 60)

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_delivery_prices()