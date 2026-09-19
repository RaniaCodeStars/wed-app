from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_admin_user
from app.models.models import User
from app.crud import crud_delivery
from app.schemas.schemas import (
    DeliveryPriceCreate,
    DeliveryPriceUpdate,
    DeliveryPriceResponse,
)


router = APIRouter(
    prefix="/admin/delivery-prices",
    tags=["Admin - Delivery Prices"],
)


@router.get(
    "/",
    response_model=List[DeliveryPriceResponse],
)
def get_delivery_prices(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    return crud_delivery.get_delivery_prices(db=db)


@router.post(
    "/",
    response_model=DeliveryPriceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_delivery_price(
    delivery_in: DeliveryPriceCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    try:
        return crud_delivery.create_delivery_price(
            db=db,
            wilaya=delivery_in.wilaya,
            home_price=delivery_in.home_price,
            office_price=delivery_in.office_price,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.put(
    "/{delivery_id}/",
    response_model=DeliveryPriceResponse,
)
def update_delivery_price(
    delivery_id: int,
    delivery_in: DeliveryPriceUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    try:
        delivery_price = crud_delivery.update_delivery_price(
            db=db,
            delivery_id=delivery_id,
            wilaya=delivery_in.wilaya,
            home_price=delivery_in.home_price,
            office_price=delivery_in.office_price,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    if not delivery_price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tarif de livraison introuvable.",
        )

    return delivery_price


@router.delete(
    "/{delivery_id}/",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_delivery_price(
    delivery_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    deleted = crud_delivery.delete_delivery_price(
        db=db,
        delivery_id=delivery_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tarif de livraison introuvable.",
        )

    return None