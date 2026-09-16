# backend/app/api/v1/endpoints/admin/landing.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User
from app.crud import crud_landing
from app.schemas.schemas import LandingContentUpdate, LandingContentResponse



from app.core.deps import get_current_admin_user


router = APIRouter(prefix="/admin/landing", tags=["Admin - Landing Page"])

@router.put("/", response_model=LandingContentResponse)
def update_landing(
    landing_in: LandingContentUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """Met à jour les textes et bannières de la landing page (Réservé Admin)."""
    return crud_landing.update_landing_content(db=db, landing_in=landing_in)