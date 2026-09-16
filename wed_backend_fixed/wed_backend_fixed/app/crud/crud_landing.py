# backend/app/crud/crud_landing.py

from sqlalchemy.orm import Session
from app.models.models import LandingContent
from app.schemas.schemas import LandingContentCreate, LandingContentUpdate

def get_landing_content(db: Session):
    """Récupère le contenu actuel de la landing page."""
    return db.query(LandingContent).first()

def update_landing_content(db: Session, landing_in: LandingContentUpdate):
    """Met à jour le contenu de la landing page."""
    db_landing = db.query(LandingContent).first()
    
    if not db_landing:
        # Si aucun contenu n'existe encore, on en crée un par défaut
        db_landing = LandingContent(
            hero_title=landing_in.hero_title or "Bienvenue sur notre boutique",
            hero_subtitle=landing_in.hero_subtitle or "Découvrez notre collection de lingerie",
            hero_image=landing_in.hero_image or "",
            announcement_bar=landing_in.announcement_bar or "Livraison offerte dès 5000 DZD"
        )
        db.add(db_landing)
    else:
        update_data = landing_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_landing, key, value)
            
    db.commit()
    db.refresh(db_landing)
    return db_landing