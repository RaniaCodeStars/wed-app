# WED ود — Frontend Next.js

Frontend Next.js (App Router, TypeScript, Tailwind v4) pour la boutique de lingerie
**WED ود**, connecté au backend FastAPI (`wed_backend_fixed`).

## Démarrage rapide

```bash
npm install
cp .env.local.example .env.local
# édite .env.local : JWT_SECRET doit être IDENTIQUE au SECRET_KEY du backend
npm run dev
```

Le backend FastAPI doit tourner en parallèle sur `http://localhost:8000`
(`uvicorn app.main:app --reload` dans le dossier backend).

Frontend sur `http://localhost:3000`. Espace admin sur `/admin/login`
(compte créé via `python create_admin.py` côté backend).

## Architecture — comment ça parle au backend

**Deux façons de communiquer avec FastAPI, jamais mélangées :**

1. **Server Components (SEO, ISR)** → `lib/server-api.ts` (`serverFetch`) appelle
   directement `BACKEND_URL` (variable serveur uniquement). Utilisé par
   `lib/data.ts` pour tout ce qui est affiché au premier rendu (catalogue,
   page produit, dashboard admin...).

2. **Client Components (interactions, mutations)** → `lib/api.ts` (`apiFetch`)
   appelle **toujours** `/api/backend/...`, jamais le backend directement.
   Cette route (`app/api/backend/[...path]/route.ts`) est un proxy générique :
   elle lit le cookie httpOnly `session`, l'ajoute en `Authorization: Bearer`,
   et retransmet la requête à FastAPI. **Le token JWT ne touche jamais le
   JavaScript du navigateur.**

**Authentification** : `/api/auth/login` appelle le backend, récupère le JWT,
et le pose dans un cookie `httpOnly` + `secure` + `sameSite=lax`. Le
`middleware.ts` vérifie ce cookie (via `jose`, même secret que le backend)
pour protéger `/admin/*` — **c'est un confort UX (redirection rapide côté
edge), pas la vraie autorisation** : chaque route admin du backend revérifie
`is_admin` en base de données à chaque requête, donc falsifier le cookie ne
débloque rien côté serveur.

**Panier** : 100% `localStorage` (`lib/cart.ts`), aucune table côté backend —
le choix le plus rapide (décision prise avec l'utilisateur). Au clic
"confirmer la commande", tout le panier part en un seul `POST /orders`.

## Structure des routes

```
app/
  layout.tsx              # Layout racine MINIMAL (polices, Toaster) — pas de Navbar/Footer ici
  (store)/                 # Groupe de routes AVEC Navbar/Footer/CartDrawer
    layout.tsx
    page.tsx                # Accueil
    shop/page.tsx            # Liste produits + filtre catégorie
    shop/[id]/page.tsx        # Fiche produit (galerie, tailles/couleurs, avis)
    checkout/page.tsx         # Formulaire de commande (wilaya, commune, domicile/bureau)
    (auth)/login, register
    account/page.tsx          # Historique des commandes (connectée)
    guide-des-tailles/page.tsx
  admin/
    login/page.tsx           # PAS de sidebar (hors du groupe (dashboard))
    (dashboard)/              # Groupe de routes AVEC AdminSidebar
      layout.tsx
      page.tsx                 # Dashboard (CA, commandes du jour, top produits)
      products/                # Liste, création, édition (upload images)
      orders/                  # Liste, détail (changement de statut, impression)
      categories/, sizes/, customers/, comments/, content/, settings/
  api/
    auth/login|register|logout|me/route.ts
    backend/[...path]/route.ts  # Proxy générique décrit plus haut
```

## Ce qui est branché et fonctionnel

- Catalogue, fiche produit, panier, checkout (wilaya validée, domicile/bureau,
  téléphone algérien) → **commande réelle créée dans le backend**
- Login/register/logout avec cookie httpOnly
- Avis clients (soumission + modération admin)
- Admin : dashboard (stats réelles), produits (CRUD + upload images + toggle
  rupture de stock + soft-delete), commandes (pipeline de statuts + impression
  bon de livraison + suppression), catégories, tailles, clientes (badge/notes),
  contenu de la page d'accueil (titre/sous-titre/bandeau)

## Limites connues / pistes pour la suite

- Pas de recherche texte ni de pagination sur `/shop` (le backend supporte déjà
  `skip`/`limit`, il suffit de brancher un composant de pagination).
- Le "bon de livraison" s'imprime via `window.print()` (mise en page basique) —
  pas de génération PDF serveur pour l'instant.
- `/admin/settings` est informatif seulement (pas de changement de mot de passe
  ni de gestion de rôles avancée — le backend n'a pas encore ces endpoints).
- Pas de tests automatisés (Playwright/Vitest) sur ce frontend.
