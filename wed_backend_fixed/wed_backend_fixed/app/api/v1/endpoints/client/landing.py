# backend/app/api/v1/endpoints/client/landing.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud import crud_landing
from app.schemas.schemas import LandingContentResponse

router = APIRouter(prefix="/landing", tags=["Client - Landing Page"])

@router.get("/", response_model=LandingContentResponse)
def get_landing(db: Session = Depends(get_db)):
    """Récupère le contenu de la landing page pour l'affichage public."""
    content = crud_landing.get_landing_content(db)
    if not content:
        # Retourne des valeurs par défaut si la table est vide
        return {
            "hero_title": "Sublimez votre féminité",
            "hero_subtitle": "Découvrez notre collection de lingerie d'exception",
            "hero_image": "",
            "announcement_bar": "✨ Livraison disponible sur 58 wilayas"
        }
    return content