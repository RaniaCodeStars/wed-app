# backend/app/crud/crud_size.py

from sqlalchemy.orm import Session
from app.models.models import SizeGroup
from app.schemas.schemas import SizeGroupCreate

def get_size_groups(db: Session):
    return db.query(SizeGroup).all()

def create_size_group(db: Session, size_in: SizeGroupCreate):
    db_size = SizeGroup(name=size_in.name, sizes_list=size_in.sizes_list)
    db.add(db_size)
    db.commit()
    db.refresh(db_size)
    return db_size

def delete_size_group(db: Session, size_id: int):
    size_group = db.query(SizeGroup).filter(SizeGroup.id == size_id).first()
    if size_group:
        db.delete(size_group)
        db.commit()
        return True
    return False