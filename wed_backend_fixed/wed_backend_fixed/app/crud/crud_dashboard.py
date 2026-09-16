# backend/app/crud/crud_dashboard.py

from datetime import datetime, timezone
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.models import Order, ProductStatistic, Product


def get_dashboard_stats(db: Session):
    """Calcule les indicateurs clés affichés sur le tableau de bord admin."""

    # Chiffre d'affaires total : on exclut les commandes annulées/retournées, qui ne
    # représentent pas un encaissement réel.
    revenue_query = db.query(func.coalesce(func.sum(Order.total_price), 0.0)).filter(
        Order.status.notin_(["cancelled", "returned"])
    )
    total_revenue = revenue_query.scalar() or 0.0

    total_orders = db.query(func.count(Order.id)).scalar() or 0

    pending_orders = db.query(func.count(Order.id)).filter(Order.status == "pending").scalar() or 0

    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    orders_today = db.query(func.count(Order.id)).filter(Order.created_at >= today_start).scalar() or 0

    top_products_query = (
        db.query(ProductStatistic, Product.title)
        .join(Product, Product.id == ProductStatistic.product_id)
        .order_by(ProductStatistic.sales_count.desc())
        .limit(3)
        .all()
    )

    top_products = [
        {
            "product_id": stat.product_id,
            "title": title,
            "sales_count": stat.sales_count,
            "total_revenue": stat.total_revenue,
        }
        for stat, title in top_products_query
    ]

    return {
        "total_revenue": total_revenue,
        "orders_today": orders_today,
        "pending_orders": pending_orders,
        "total_orders": total_orders,
        "top_products": top_products,
    }
