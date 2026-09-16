# backend/app/core/config.py
"""
Configuration centralisee de l'application.
Toutes les valeurs sensibles/variables viennent du fichier .env
(voir .env.example a la racine du projet).
"""
import os
from dotenv import load_dotenv

load_dotenv()


def _get_bool(name: str, default: bool) -> bool:
    val = os.getenv(name)
    if val is None:
        return default
    return val.strip().lower() in ("1", "true", "yes", "on")


class Settings:
    # --- Base de donnees ---
    # Par defaut : SQLite local (fichier ecommerce.db), fonctionne sans configuration.
    # En production, definis DATABASE_URL dans .env, ex:
    # postgresql://user:password@host:5432/dbname
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ecommerce.db")

    # --- Securite / JWT ---
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-me-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 7)))

    # --- CORS (Next.js frontend) ---
    # Liste d'origines separees par des virgules dans .env, ex:
    # CORS_ORIGINS=http://localhost:3000,https://www.wed-lingerie.com
    _raw_origins: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")
    CORS_ORIGINS: list = [o.strip() for o in _raw_origins.split(",") if o.strip()]

    # --- Stockage des images produits ---
    # Dossier local ou sont sauvegardees les images uploadees par l'admin.
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")

    # --- Compte admin par defaut (utilise par create_admin.py) ---
    DEFAULT_ADMIN_EMAIL: str = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@wed-lingerie.com")
    DEFAULT_ADMIN_PASSWORD: str = os.getenv("DEFAULT_ADMIN_PASSWORD", "ChangeMe123!")


settings = Settings()
