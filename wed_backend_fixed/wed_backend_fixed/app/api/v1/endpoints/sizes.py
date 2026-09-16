# backend/app/api/v1/endpoints/sizes.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.models import User
from app.schemas.schemas import SizeGroupCreate, SizeGroupResponse
from app.crud import crud_size
from app.core.deps import get_current_admin_user

router = APIRouter(prefix="/sizes", tags=["Sizes"])


@router.get("/", response_model=List[SizeGroupResponse])
def get_size_groups(db: Session = Depends(get_db)):
    """Public : liste des groupes de tailles disponibles (ex: S,M,L,XL)."""
    return crud_size.get_size_groups(db=db)


@router.post("/", response_model=SizeGroupResponse, status_code=status.HTTP_201_CREATED)
def create_size_group(size_in: SizeGroupCreate, db: Session = Depends(get_db), admin_user: User = Depends(get_current_admin_user)):
    """Admin : cree un groupe de tailles."""
    return crud_size.create_size_group(db=db, size_in=size_in)


@router.delete("/{size_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_size_group(size_id: int, db: Session = Depends(get_db), admin_user: User = Depends(get_current_admin_user)):
    """Admin : supprime un groupe de tailles."""
    success = crud_size.delete_size_group(db=db, size_id=size_id)
    if not success:
        raise HTTPException(status_code=404, detail="Groupe de taille introuvable")
    return None
