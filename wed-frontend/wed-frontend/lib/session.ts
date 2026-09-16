// lib/session.ts
// Helpers "server-only" pour lire/vérifier le JWT stocké dans le cookie httpOnly.
// Le JWT est émis par le backend FastAPI (/auth/login) ; on le vérifie ici avec le
// même secret (JWT_SECRET === SECRET_KEY du backend) pour ne jamais faire un aller-retour
// réseau juste pour savoir "est-ce un admin ?".
//
// IMPORTANT (sécurité) : ce fichier sert UNIQUEMENT à décider de l'UI / des redirections
// côté Next.js (ex: rediriger un non-admin loin de /admin). L'autorisation réelle est
// TOUJOURS revérifiée par le backend (get_current_admin_user) sur chaque requête API.
// Voir backend/app/api/v1/endpoints/auth.py pour la note de sécurité correspondante.

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const SESSION_COOKIE = "session";

export interface SessionPayload {
  sub: string; // email
  is_admin: boolean;
  role?: string | null;
  exp: number;
}

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET manquant dans .env.local (doit être identique au SECRET_KEY backend).");
  }
  return new TextEncoder().encode(secret);
}

/** Lit et vérifie le token depuis le cookie httpOnly. Retourne null si absent/invalide/expiré. */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Le token brut, à transmettre en Authorization: Bearer <token> vers le backend. */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}
