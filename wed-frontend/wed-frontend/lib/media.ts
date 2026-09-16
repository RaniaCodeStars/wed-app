// lib/media.ts

const PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

/** Construit l'URL publique complète d'une image produit servie par le backend
 * (ex: "/uploads/products/xxx.jpg" -> "http://localhost:8000/uploads/products/xxx.jpg"). */
export function getImageUrl(path?: string | null): string {
  if (!path) return "/placeholder-product.svg";
  if (path.startsWith("http")) return path;
  return `${PUBLIC_BACKEND_URL}${path}`;
}
