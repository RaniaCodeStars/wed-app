# Guide complet — Lancer WED ود (backend + frontend) et tout tester

Ce guide part du moment où tu télécharges les 2 fichiers `.zip` jusqu'au test de
chaque fonctionnalité, une par une. Suis les étapes dans l'ordre, sans en sauter.

**Prérequis à installer avant de commencer (si pas déjà fait) :**
- **Python 3.11 ou plus récent** → https://www.python.org/downloads/ (coche "Add to PATH" à l'installation sous Windows)
- **Node.js 20 ou plus récent** → https://nodejs.org (installe la version "LTS")
- Un éditeur de code (VS Code recommandé) — optionnel mais pratique

Pour vérifier que tout est installé, ouvre un terminal et tape :
```bash
python --version
node --version
npm --version
```
Si une commande n'est pas reconnue, réinstalle l'outil correspondant.

---

## PHASE 0 — Extraction des deux zips

1. Crée un dossier de travail, par exemple `wed-project` sur ton Bureau.
2. Dézippe `wed_backend_fixed.zip` **dans ce dossier** → tu obtiens `wed-project/wed_backend_fixed/`
3. Dézippe `wed-frontend.zip` **dans ce même dossier** → tu obtiens `wed-project/wed-frontend/`

Tu dois te retrouver avec cette structure :
```
wed-project/
├── wed_backend_fixed/
└── wed-frontend/
```

Ouvre **deux fenêtres de terminal séparées** (une pour le backend, une pour le
frontend) — les deux doivent tourner **en même temps**.

---

## PHASE 1 — Lancer le backend (FastAPI)

### 1.1 Ouvrir un terminal dans le dossier backend
```bash
cd wed-project/wed_backend_fixed
```

### 1.2 Créer et activer un environnement virtuel Python
Ceci isole les librairies du projet pour éviter tout conflit avec d'autres projets Python sur ta machine.

```bash
python -m venv venv
```

Puis active-le :
- **Windows (PowerShell)** : `venv\Scripts\Activate.ps1`
- **Windows (cmd)** : `venv\Scripts\activate.bat`
- **Mac / Linux** : `source venv/bin/activate`

Tu dois voir `(venv)` apparaître au début de la ligne de ton terminal. **Fais
bien ça à chaque fois que tu rouvres un terminal pour le backend.**

### 1.3 Installer les dépendances Python
```bash
pip install -r requirements.txt
```
Ça peut prendre 1 à 2 minutes.

### 1.4 Configurer le fichier `.env`
Un fichier `.env` existe déjà à la racine de `wed_backend_fixed/` avec des
valeurs par défaut qui fonctionnent tel quel en local (base SQLite). Ouvre-le
quand même pour repérer une ligne importante :

```
SECRET_KEY=change-me-generate-a-long-random-string-in-production
```

**Retiens cette valeur** (ou remplace-la par une chaîne aléatoire à toi) — tu
devras mettre **exactement la même** côté frontend dans quelques minutes.

### 1.5 Vérifier/mettre à jour la base de données
La base `ecommerce.db` fournie est déjà à jour et contient **5 produits
d'exemple** et **1 compte admin existant** (`admin@codenova.com`, mot de passe
inconnu — ignore-le, on va en créer un nouveau à toi juste après). Par
sécurité, lance quand même la commande de migration (elle ne fera rien si tout
est déjà à jour) :

```bash
alembic upgrade head
```

### 1.6 Créer TON compte admin
```bash
python create_admin.py
```
Ça crée un admin avec l'email/mot de passe définis dans `.env` :
```
DEFAULT_ADMIN_EMAIL=admin@wed-lingerie.com
DEFAULT_ADMIN_PASSWORD=ChangeMe123!
```
**Retiens ces identifiants**, tu vas t'en servir pour te connecter à
`/admin/login` côté frontend. Change ce mot de passe dans `.env` avant si tu
veux un mot de passe personnalisé (relance le script après modification).

### 1.7 Démarrer le serveur backend
```bash
uvicorn app.main:app --reload
```

Tu dois voir dans le terminal :
```
Uvicorn running on http://127.0.0.1:8000
```

### 1.8 Vérifier que le backend fonctionne
Ouvre ton navigateur sur **http://localhost:8000/docs** — tu dois voir la
documentation interactive Swagger de l'API avec toutes les routes (`/auth`,
`/products`, `/orders`, `/admin/...`, etc.). Si cette page s'affiche, le
backend fonctionne. **Laisse ce terminal ouvert et tournant.**

---

## PHASE 2 — Lancer le frontend (Next.js)

### 2.1 Ouvrir un **second** terminal, dans le dossier frontend
```bash
cd wed-project/wed-frontend
```

### 2.2 Installer les dépendances Node
```bash
npm install
```
Ça peut prendre 2 à 3 minutes la première fois.

### 2.3 Créer le fichier `.env.local`
```bash
cp .env.local.example .env.local
```
(Sous Windows cmd, utilise `copy .env.local.example .env.local`)

Ouvre `.env.local` et vérifie/complète ces 3 lignes :
```
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
JWT_SECRET=change-me-generate-a-long-random-string-in-production
```
**⚠️ Point critique** : `JWT_SECRET` doit être **exactement identique** au
`SECRET_KEY` que tu as noté à l'étape 1.4 côté backend. Si les deux ne
correspondent pas, le frontend ne pourra jamais reconnaître un utilisateur
comme admin (le middleware rejettera systématiquement `/admin/*`).

### 2.4 Démarrer le serveur frontend
```bash
npm run dev
```

Tu dois voir :
```
Local: http://localhost:3000
```

### 2.5 Vérifier que le frontend fonctionne
Ouvre **http://localhost:3000** — la page d'accueil WED ود doit s'afficher
avec le hero, les catégories, et les 5 produits d'exemple visibles dans la
section "منتجاتنا المميزة". Si tu vois une page vide ou une erreur réseau,
va directement à la section **Dépannage** en bas de ce guide.

À partir d'ici, **les deux terminaux (backend + frontend) doivent rester
ouverts et tourner en continu** pendant tous tes tests.

---

## PHASE 3 — Tester toutes les fonctionnalités, une par une

### 🛍️ Côté client (visiteuse / cliente)

| # | Test | Où | Résultat attendu |
|---|------|-----|-------------------|
| 1 | Page d'accueil | `/` | Hero, catégories, produits vedettes s'affichent |
| 2 | Navigation catégories | Clique une pastille de catégorie | Redirige vers `/shop?category=X` filtré |
| 3 | Liste boutique | `/shop` | Les 5 produits d'exemple s'affichent en grille |
| 4 | Fiche produit | Clique un produit | Galerie, prix, description, tailles/couleurs si définies |
| 5 | Ajout au panier | Bouton "+" sur une carte produit OU sur la fiche produit | Toast de confirmation + le compteur du panier (icône sac) s'incrémente instantanément |
| 6 | Panier (drawer) | Clique l'icône panier dans la navbar | Le tiroir latéral s'ouvre avec les articles, quantités modifiables (+/-), suppression possible |
| 7 | Créer un compte | `/register` | Formulaire email + téléphone (optionnel, format 05/06/07 + 8 chiffres) + mot de passe → connecte automatiquement après création |
| 8 | Connexion | `/login` | Email + mot de passe → redirige vers `/account` |
| 9 | Checkout invité (sans compte) | Ajoute un produit au panier → `/checkout` **sans être connectée** | Le formulaire doit accepter la commande quand même (c'est la fonctionnalité "commande invité") |
| 10 | Validation téléphone | Sur `/checkout`, entre un numéro invalide (ex: `123`) | Message d'erreur "رقم هاتف غير صالح" |
| 11 | Choix livraison "domicile" | Sélectionne "توصيل للمنزل" | Le champ "العنوان الكامل" devient obligatoire |
| 12 | Choix livraison "bureau" | Sélectionne "استلام من المكتب" | Le champ "اسم المكتب" devient obligatoire à la place |
| 13 | Confirmation de commande | Remplis tout correctement → "تأكيد الطلب الآن" | Écran de succès avec numéro `#WED-X`, le panier se vide automatiquement |
| 14 | Historique des commandes | Connecte-toi puis va sur `/account` | La commande passée (si tu étais connectée en la passant) apparaît avec son statut |
| 15 | Laisser un avis | Sur une fiche produit, section "تقييمات الزبائن" (connectée uniquement) | L'avis apparaît en "قيد المراجعة" (pas encore visible publiquement — normal, il attend la modération admin) |
| 16 | Déconnexion | Bouton رouge sur `/account` | Retour à l'accueil, session effacée |

### 🛠️ Côté admin

D'abord : va sur **http://localhost:3000/admin/login** et connecte-toi avec
les identifiants créés à l'étape 1.6 (`admin@wed-lingerie.com` /
`ChangeMe123!` sauf si tu les as changés).

| # | Test | Où | Résultat attendu |
|---|------|-----|-------------------|
| 17 | Accès protégé | Essaie d'aller sur `/admin` **sans être connectée** (navigation privée) | Redirection automatique vers `/admin/login` |
| 18 | Dashboard | `/admin` après connexion | Chiffre d'affaires, commandes du jour, commandes en attente, top produits (vide au début si aucune vente) |
| 19 | Liste produits | `/admin/products` | Les 5 produits d'exemple + ceux que tu ajoutes |
| 20 | Ajouter un produit | `/admin/products/new` | Remplis titre/prix/stock/catégorie + upload 1-2 images → doit apparaître dans la liste et sur `/shop` côté client |
| 21 | Modifier un produit | Icône crayon sur un produit | Formulaire pré-rempli, modifie un champ, sauvegarde, vérifie le changement côté client |
| 22 | Toggle "rupture de stock" | Interrupteur vert/gris dans la colonne "متوفر؟" | Bascule instantanément ; côté client, le produit affiche "غير متوفر" et le bouton d'ajout au panier se désactive |
| 23 | Supprimer un produit (soft-delete) | Icône poubelle | Le produit passe en "محذوف" (grisé) dans la liste admin mais **disparaît complètement** de `/shop` côté client |
| 24 | Catégories | `/admin/categories` | Ajoute une catégorie → doit apparaître immédiatement dans le `<select>` de création produit et sur les pastilles de la page d'accueil |
| 25 | Tailles | `/admin/sizes` | Ajoute un groupe de tailles (ex: `S,M,L,XL`) |
| 26 | Liste des commandes | `/admin/orders` | La commande passée à l'étape 13 doit apparaître |
| 27 | Détail commande | Clique une ligne de commande | Nom, téléphone, wilaya/commune, type de livraison, articles, montant |
| 28 | Changer le statut | Boutons "مؤكدة", "تم الشحن", "تم التسليم", "مرتجعة", "إلغاء الطلبية" | Le statut se met à jour immédiatement (vérifiable aussi sur `/account` côté client) |
| 29 | Imprimer le bon de livraison | Bouton "طباعة وصل التسليم" | Ouvre la boîte de dialogue d'impression du navigateur |
| 30 | Supprimer une commande | Icône poubelle sur le détail | Confirmation → disparaît de la liste |
| 31 | Gestion des clientes | `/admin/customers` | La cliente créée à l'étape 7 doit apparaître |
| 32 | Fiche cliente | Clique une cliente | Ajoute une "شارة" (ex: `زبونة مميزة ✦`) et une note interne → sauvegarde |
| 33 | Modération des avis | `/admin/comments` | L'avis laissé à l'étape 15 apparaît en "قيد المراجعة" → clique ✓ pour l'approuver |
| 34 | Vérifier l'avis approuvé | Retourne sur la fiche produit correspondante côté client | L'avis est maintenant visible publiquement |
| 35 | Contenu de la page d'accueil | `/admin/content` | Modifie le titre du hero → sauvegarde → recharge `/` côté client, le nouveau titre doit s'afficher |

---

## Dépannage (erreurs les plus fréquentes)

**"Failed to fetch" / page blanche sur le frontend**
→ Le backend n'est pas lancé, ou tourne sur un autre port. Vérifie que
`http://localhost:8000/docs` répond bien dans ton navigateur.

**Je me connecte sur `/admin/login` mais je suis renvoyée en boucle vers `/admin/login`**
→ `JWT_SECRET` (frontend) ≠ `SECRET_KEY` (backend). Recopie exactement la
même valeur dans les deux fichiers `.env`, puis redémarre **les deux**
serveurs (`Ctrl+C` puis relance `uvicorn ...` et `npm run dev`).

**"هذا الحساب لا يملك صلاحية الوصول" en essayant de me connecter en admin**
→ Le compte utilisé n'a pas `is_admin=True`. Utilise le compte créé par
`python create_admin.py`, pas un compte client normal créé via `/register`.

**Les images ne s'affichent pas (icône image cassée)**
→ Vérifie que `NEXT_PUBLIC_BACKEND_URL` dans `.env.local` pointe bien vers
`http://localhost:8000` et que le backend tourne toujours.

**Erreur 422 en passant une commande**
→ Vérifie le format du téléphone (`05`/`06`/`07` + 8 chiffres, donc 10 au
total) et que tu as bien sélectionné une wilaya dans la liste déroulante (pas
tapé le nom à la main).

**`pip install` échoue avec une erreur "externally-managed-environment"**
→ Tu n'as pas activé le venv (étape 1.2). Vérifie que `(venv)` apparaît bien
au début de ta ligne de terminal avant de relancer `pip install -r requirements.txt`.

**Le port 8000 ou 3000 est déjà utilisé**
→ Un autre programme l'utilise déjà. Ferme-le, ou lance le backend sur un
autre port avec `uvicorn app.main:app --reload --port 8001` (n'oublie pas
alors de mettre à jour `BACKEND_URL` et `NEXT_PUBLIC_BACKEND_URL` en
conséquence dans `.env.local`).
