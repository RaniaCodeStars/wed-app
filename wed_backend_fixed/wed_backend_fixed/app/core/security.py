# backend/app/core/security.py

from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

# --- CONFIGURATION DE SECURITE (lue depuis .env via config.py) ---
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# --- 1. GESTION DES MOTS DE PASSE ---

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifie si le mot de passe en clair correspond au hash stocke."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Transforme un mot de passe en clair en un hash securise."""
    return pwd_context.hash(password)


# --- 2. GENERATION DU TOKEN JWT ---

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Cree un token JWT chiffre contenant les donnees utilisateur (ex: email)."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# NOTE: les dependances get_current_user / get_current_admin_user (verification du
# token sur les routes protegees) vivent dans app/core/deps.py pour eviter les
# imports circulaires avec app/core/database.py et app/models/models.py.
