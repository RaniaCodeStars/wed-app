# backend/app/api/v1/endpoints/client/orders.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.deps import get_current_user_optional  # Assure-toi d'avoir cette dépendance optionnelle
from app.models.models import User
from app.crud import crud_order
from app.schemas.schemas import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["Client - Orders"])

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Passe une nouvelle commande. 
    La connexion n'est plus obligatoire (Guest Checkout supporté).
    """
    try:
        order = crud_order.create_order(db=db, order_in=order_in, current_user=current_user)
        return order
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère l'historique des commandes de la cliente connectée (authentification requise)."""
    return crud_order.get_user_orders(db=db, user_id=current_user.id)