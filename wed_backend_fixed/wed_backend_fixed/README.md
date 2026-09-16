# Wed – Backend API (Lingerie E-commerce)

API FastAPI pour la boutique de lingerie **Wed**, avec deux profils :
- **Admin** : produits, commandes, inventaire, clientes, landing page
- **Client** : catalogue, panier, commandes, avis

## Démarrage rapide (local, SQLite)

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Applique les migrations (crée le fichier ecommerce.db)
alembic upgrade head

# Crée le compte administrateur (email/mdp définis dans .env)
python create_admin.py

# Lance le serveur
uvicorn app.main:app --reload
```

L'API est alors sur `http://localhost:8000`, la doc interactive sur `http://localhost:8000/docs`.

## Configuration (.env)

Toute la config sensible vit dans `.env` (voir `.env.example`) :
- `DATABASE_URL` : SQLite par défaut, ou une URL Postgres/Supabase en production
- `SECRET_KEY` : clé JWT — **à régénérer** avant toute mise en prod
- `CORS_ORIGINS` : liste des origines autorisées à appeler l'API (ton frontend Next.js, ex: `http://localhost:3000`)
- `UPLOAD_DIR` : dossier où sont stockées les images produits uploadées

⚠️ **Sécurité** : l'ancien `alembic/env.py` contenait un mot de passe Supabase en clair.
Si ce mot de passe est réel, **régénère-le immédiatement** depuis le dashboard Supabase
(Database → Reset password) — il ne doit plus jamais être commité dans le code.

## Endpoints principaux (tous sous `/api/v1`)

### Auth
- `POST /auth/register`, `POST /auth/login`, `GET /auth/users/me`

### Données de référence
- `GET /wilayas` — liste officielle des 58 wilayas (code, nom FR, nom AR) — source unique partagée avec le frontend.

### Client
- `GET /products` (filtrable par `category_id`), `GET /products/categories`, `GET /products/{id}`
- `POST /orders` — passe une commande (invité ou connecté). Le panier est géré côté frontend
  (localStorage) ; cette route reçoit directement la liste d'articles au moment du checkout.
- `GET /orders` (mes commandes, connexion requise)
- `GET|POST /reviews`
- `GET /landing`

### Admin (JWT + `is_admin=True` requis)
- `POST /admin/products` (multipart, upload d'images), `GET/PUT/DELETE /admin/products/{id}`
- `PATCH /admin/products/{id}/availability` — toggle rapide "rupture de stock"
- `POST /admin/products/{id}/images` (ajouter des images à un produit existant)
- `POST /admin/products/categories`
- `GET /admin/orders`, `GET /admin/orders/{id}`, `PUT /admin/orders/{id}/status`,
  `POST /admin/orders/{id}/confirm`, `DELETE /admin/orders/{id}`
- `GET /admin/dashboard/stats` — CA total, commandes du jour, commandes en attente, top 3 produits
- `GET /admin/users`, `GET /admin/users/{id}`, `PUT /admin/users/{id}` (badge, notes, statut)
- `PUT /admin/landing`
- `POST/DELETE /sizes`, `PATCH/DELETE /reviews/{id}` (modération)

Les images produits uploadées sont servies statiquement sur `/uploads/products/...`.

## Décisions d'architecture (cahier des charges "Wed Lingerie DZ")

- **Panier** : 100% côté frontend (localStorage), pas de table `cart_items` côté backend —
  le plus rapide et le plus simple. Au checkout, le frontend envoie directement la liste
  d'articles à `POST /orders`.
- **Statuts de commande** (fusion doc + existant) : `pending`, `confirmed`, `shipped`,
  `delivered`, `returned`, `cancelled`.
- **Livraison** : `delivery_type` = `"domicile"` (nécessite `address`) ou `"bureau"`
  (nécessite `office_name`), + `wilaya` (validée contre la liste officielle) + `commune`.
- **Téléphone** : validé côté serveur, format algérien (10 chiffres, commence par 05/06/07).
- **Produits** : `is_active` (soft-delete — un produit supprimé reste lié aux anciennes
  commandes) et `is_available` (toggle "rupture de stock" indépendant du compteur `stock`).
- **Auth admin (Next.js)** : le JWT est émis par `/auth/login` et contient `is_admin`/`role`
  en clair dans le payload — **uniquement** pour que le middleware Next.js décide vite (côté
  edge, sans appel réseau) s'il doit rediriger vers `/admin/login`. Le backend ne fait
  **jamais confiance à ces claims pour l'autorisation réelle** : chaque route admin revérifie
  `is_admin` en base via `get_current_admin_user` à chaque requête. Le pattern recommandé
  côté Next.js : une route API (`/app/api/auth/login/route.ts`) qui appelle ce backend et pose
  le JWT dans un cookie `httpOnly` + `secure`, puis un `middleware.ts` qui décode ce cookie
  (via `jose`, avec le même `SECRET_KEY` côté serveur Next.js) pour protéger `/admin/*`.


## Frontend Next.js

- Configure `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1` côté Next.js.
- Le login utilise `OAuth2PasswordRequestForm` (form-urlencoded, champs `username`/`password`) —
  pense à envoyer `application/x-www-form-urlencoded` et non du JSON pour `/auth/login`.
- Le token JWT se renvoie ensuite en header `Authorization: Bearer <token>`.
- CORS est déjà ouvert pour `http://localhost:3000` par défaut.
