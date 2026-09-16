// lib/server-api.ts
// Fetch "server-only" pour les Server Components (SEO, ISR/Data Cache).
// Appelle directement le backend FastAPI (pas de saut inutile par notre propre proxy).

import { getSessionToken } from "./session";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

interface ServerFetchOptions extends RequestInit {
  /** true = joint le token admin (Server Components des pages /admin) */
  withAuth?: boolean;
  /** Revalidation ISR en secondes. Par défaut : pas de cache (données dynamiques : stock, prix). */
  revalidate?: number | false;
}

export async function serverFetch<T>(path: string, options: ServerFetchOptions = {}): Promise<T> {
  const { withAuth, revalidate, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (withAuth) {
    const token = await getSessionToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BACKEND_URL}/api/v1${path}`, {
    ...rest,
    headers: finalHeaders,
    next: revalidate === false ? undefined : { revalidate: revalidate ?? 60 },
    cache: revalidate === false ? "no-store" : undefined,
  });

  if (!res.ok) {
    let detail = `Erreur ${res.status}`;
    try {
      const body = await res.json();
      detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch {
      /* réponse non-JSON, on garde le message par défaut */
    }
    throw new Error(detail);
  }

  if (res.status === 204) return null as T;
  return res.json();
}
