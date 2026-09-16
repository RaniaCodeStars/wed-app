import sys
import os

# Ajoute le dossier courant au PYTHONPATH pour que les imports "app" fonctionnent
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.config import settings
from app.models.models import User
from app.core.security import get_password_hash


def create_super_admin():
    db: Session = SessionLocal()

    admin_email = settings.DEFAULT_ADMIN_EMAIL
    admin_password = settings.DEFAULT_ADMIN_PASSWORD

    existing_user = db.query(User).filter(User.email == admin_email).first()
    if existing_user:
        print(f"⚠️  Un utilisateur avec l'email '{admin_email}' existe deja.")
        if not existing_user.is_admin:
            existing_user.is_admin = True
            existing_user.role = "admin"
            db.commit()
            print(f"✅ L'utilisateur {admin_email} a ete promu administrateur avec succes !")
        db.close()
        return

    hashed_password = get_password_hash(admin_password)
    new_admin = User(
        email=admin_email,
        hashed_password=hashed_password,
        is_admin=True,
        role="admin",
    )

    db.add(new_admin)
    db.commit()
    db.close()

    print("🎉 Administrateur cree avec succes !")
    print(f"📧 Email : {admin_email}")
    print(f"🔑 Mot de passe : {admin_password}")
    print("⚠️  Pense a definir DEFAULT_ADMIN_EMAIL / DEFAULT_ADMIN_PASSWORD dans .env "
          "et a changer ce mot de passe apres la premiere connexion.")


if __name__ == "__main__":
    create_super_admin()
