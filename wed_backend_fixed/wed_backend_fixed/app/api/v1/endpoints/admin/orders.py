# backend/app/api/v1/endpoints/admin/orders.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.models import User
from app.crud import crud_order
from app.schemas.schemas import OrderResponse, OrderStatusUpdate
from app.core.deps import get_current_admin_user

router = APIRouter(prefix="/admin/orders", tags=["Admin - Orders"])


@router.get("/", response_model=List[OrderResponse])
def get_all_shop_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Recupere toutes les commandes de la boutique, les plus recentes en premier (Reserve Admin)."""
    return crud_order.get_all_orders(db=db, skip=skip, limit=limit)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_detail(
    order_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Recupere le detail complet d'une commande (Reserve Admin)."""
    order = crud_order.get_order_by_id(db=db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Commande introuvable.")
    return order


@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Met a jour le statut d'une commande (ex: confirmed, shipped, returned, denied) (Reserve Admin)."""
    updated_order = crud_order.update_order_status(db=db, order_id=order_id, new_status=status_update.status)
    if not updated_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Commande introuvable.")
    return updated_order


@router.post("/{order_id}/confirm", response_model=OrderResponse)
def confirm_order(
    order_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Raccourci pratique pour confirmer une commande (equivaut a status=confirmed)."""
    updated_order = crud_order.update_order_status(db=db, order_id=order_id, new_status="confirmed")
    if not updated_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Commande introuvable.")
    return updated_order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Supprime une commande (Reserve Admin)."""
    deleted = crud_order.delete_order(db=db, order_id=order_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Commande introuvable.")
    return None
