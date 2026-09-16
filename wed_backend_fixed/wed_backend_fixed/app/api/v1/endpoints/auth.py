# backend/app/api/v1/endpoints/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.deps import get_current_user
from app.models.models import User
from app.schemas.schemas import UserCreate, UserResponse, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Inscrit un nouvel utilisateur (client)."""
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un utilisateur avec cet email existe deja.",
        )

    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        is_admin=False,
        phone=user_in.phone,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Connecte un utilisateur (client ou admin) et retourne un token JWT d'acces."""
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ce compte a ete desactive.",
        )

    # NOTE SECURITE : is_admin/role sont inclus dans le JWT uniquement pour permettre
    # au middleware Next.js de decider rapidement (cote edge) s'il doit rediriger vers
    # /admin/login, SANS appel reseau supplementaire. Ce ne sont JAMAIS des claims de
    # confiance pour l'autorisation reelle : chaque route sensible du backend revalide
    # is_admin en base de donnees via get_current_admin_user (voir app/core/deps.py),
    # donc un token falsifie ne peut de toute facon rien debloquer cote serveur.
    access_token = create_access_token(
        data={"sub": user.email, "is_admin": user.is_admin, "role": user.role}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Retourne le profil de l'utilisateur actuellement authentifie."""
    return current_user
