# backend/app/api/v1/endpoints/reviews.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.models import User
from app.schemas.schemas import ReviewCreate, ReviewResponse, ReviewStatusUpdate
from app.crud import crud_review
from app.core.deps import get_current_user, get_current_admin_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("/product/{product_id}", response_model=List[ReviewResponse])
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    """Avis approuves d'un produit (public)."""
    return crud_review.get_product_reviews(db=db, product_id=product_id, approved_only=True)


@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(review_in: ReviewCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Une cliente connectee laisse un avis (en attente de validation admin)."""
    return crud_review.create_review(db=db, review_in=review_in, user_id=current_user.id)


# --- Routes Administrateur (protegees par get_current_admin_user) ---

@router.get("/admin/all", response_model=List[ReviewResponse])
def get_all_reviews_admin(db: Session = Depends(get_db), admin_user: User = Depends(get_current_admin_user)):
    return crud_review.get_all_reviews(db=db)


@router.patch("/{review_id}/status", response_model=ReviewResponse)
def update_review_status(review_id: int, status_update: ReviewStatusUpdate, db: Session = Depends(get_db), admin_user: User = Depends(get_current_admin_user)):
    review = crud_review.update_review_status(db=db, review_id=review_id, status=status_update.status)
    if not review:
        raise HTTPException(status_code=404, detail="Avis introuvable")
    return review


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(review_id: int, db: Session = Depends(get_db), admin_user: User = Depends(get_current_admin_user)):
    success = crud_review.delete_review(db=db, review_id=review_id)
    if not success:
        raise HTTPException(status_code=404, detail="Avis introuvable")
    return None
