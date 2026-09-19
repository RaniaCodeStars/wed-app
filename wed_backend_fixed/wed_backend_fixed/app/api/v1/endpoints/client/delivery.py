from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud import crud_delivery
from app.schemas.schemas import DeliveryPriceResponse


router = APIRouter(
    prefix="/delivery-prices",
    tags=["Client - Delivery Prices"],
)


@router.get(
    "/{wilaya}",
    response_model=DeliveryPriceResponse,
)
def get_delivery_price_by_wilaya(
    wilaya: str,
    db: Session = Depends(get_db),
):
    delivery_price = crud_delivery.get_delivery_price_by_wilaya(
        db=db,
        wilaya=wilaya,
    )

    if not delivery_price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucun tarif de livraison n'est configuré pour cette wilaya.",
        )

    return delivery_price