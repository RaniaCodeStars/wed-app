// lib/api.ts
// Fetch "client-side" : passe toujours par notre proxy /api/backend/* (voir la Route
// Handler correspondante), jamais directement vers le backend FastAPI.

export class ApiClientError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function extractDetail(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const detail = (body as { detail?: unknown }).detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((d) => (typeof d === "object" && d && "msg" in d ? (d as { msg: string }).msg : String(d))).join(" · ");
  }
  return fallback;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;


  // S'assure que l'URL se termine par un slash si c'est une route d'API (et non un fichier)
  let normalizedPath = path;
  if (!normalizedPath.endsWith("/") && !normalizedPath.includes("?") && !normalizedPath.includes(".")) {
    normalizedPath += "/";
  }

  const res = await fetch(`/api/backend${normalizedPath}`, {
    ...options,
    headers: isFormData
      ? options.headers
      : { "Content-Type": "application/json", ...(options.headers as Record<string, string>) },
  });

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      /* pas de JSON */
    }
    throw new ApiClientError(extractDetail(body, `Erreur ${res.status}`), res.status);
  }

  if (res.status === 204) return null as T;
  return res.json();
}
