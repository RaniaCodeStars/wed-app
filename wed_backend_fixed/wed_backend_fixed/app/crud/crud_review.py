# backend/app/crud/crud_review.py

from sqlalchemy.orm import Session
from app.models.models import Review
from app.schemas.schemas import ReviewCreate

def get_product_reviews(db: Session, product_id: int, approved_only: bool = True):
    query = db.query(Review).filter(Review.product_id == product_id)
    if approved_only:
        query = query.filter(Review.status == "approved")
    return query.all()

def get_all_reviews(db: Session):
    return db.query(Review).all()

def create_review(db: Session, review_in: ReviewCreate, user_id: int):
    db_review = Review(
        product_id=review_in.product_id,
        user_id=user_id,
        customer_name=review_in.customer_name,
        rating=review_in.rating,
        text=review_in.text,
        status="pending"  # En attente de validation admin par défaut
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def update_review_status(db: Session, review_id: int, status: str):
    review = db.query(Review).filter(Review.id == review_id).first()
    if review:
        review.status = status
        db.commit()
        db.refresh(review)
    return review

def delete_review(db: Session, review_id: int):
    review = db.query(Review).filter(Review.id == review_id).first()
    if review:
        db.delete(review)
        db.commit()
        return True
    return False