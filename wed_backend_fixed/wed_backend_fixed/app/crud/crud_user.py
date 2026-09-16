# backend/app/crud/crud_user.py

from typing import Optional
from sqlalchemy.orm import Session
from app.models.models import User
from app.schemas.schemas import UserAdminUpdate


def get_users(db: Session, skip: int = 0, limit: int = 100):
    """Liste les clientes (non-admin) pour l'espace admin."""
    return (
        db.query(User)
        .filter(User.is_admin == False)  # noqa: E712
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def update_user_admin_notes(db: Session, user_id: int, user_update: UserAdminUpdate) -> Optional[User]:
    """Met a jour les infos qu'un admin peut editer sur la fiche d'une cliente
    (badge, notes internes, statut actif, coordonnees)."""
    user = get_user_by_id(db, user_id)
    if not user:
        return None

    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user
