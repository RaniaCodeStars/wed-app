# backend/app/api/v1/endpoints/admin/users.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.models import User
from app.crud import crud_user
from app.schemas.schemas import UserResponse, UserAdminUpdate
from app.core.deps import get_current_admin_user

router = APIRouter(prefix="/admin/users", tags=["Admin - Clients"])


@router.get("/", response_model=List[UserResponse])
def get_all_clients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Liste toutes les clientes de la boutique (Reserve Admin)."""
    return crud_user.get_users(db=db, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserResponse)
def get_client_detail(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Recupere la fiche detaillee d'une cliente (Reserve Admin)."""
    user = crud_user.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente introuvable.")
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_client(
    user_id: int,
    user_update: UserAdminUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Met a jour la fiche d'une cliente : badge, notes internes, statut actif, coordonnees (Reserve Admin)."""
    updated_user = crud_user.update_user_admin_notes(db=db, user_id=user_id, user_update=user_update)
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente introuvable.")
    return updated_user
