# backend/app/api/v1/endpoints/wilayas.py

from fastapi import APIRouter
from typing import List

from app.core.wilayas import WILAYAS
from app.schemas.schemas import WilayaResponse

router = APIRouter(prefix="/wilayas", tags=["Wilayas"])


@router.get("/", response_model=List[WilayaResponse])
def list_wilayas():
    """Liste officielle des 58 wilayas d'Algérie (source unique partagée avec le frontend)."""
    return WILAYAS
