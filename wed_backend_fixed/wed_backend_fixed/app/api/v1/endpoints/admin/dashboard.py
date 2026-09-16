# backend/app/api/v1/endpoints/admin/dashboard.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import User
from app.crud import crud_dashboard
from app.schemas.schemas import DashboardStatsResponse
from app.core.deps import get_current_admin_user

router = APIRouter(prefix="/admin/dashboard", tags=["Admin - Dashboard"])


@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Indicateurs clés : chiffre d'affaires total, commandes du jour, commandes en attente,
    et top 3 des produits les plus vendus."""
    return crud_dashboard.get_dashboard_stats(db=db)
