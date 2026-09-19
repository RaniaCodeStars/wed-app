import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "@/lib/session";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:8000";

async function handler(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  // --------------------------------------------------
  // Construit le chemin demandé
  // --------------------------------------------------

  const targetPath = path.join("/");
  const search = req.nextUrl.search;

  // --------------------------------------------------
  // Cas spécial :
  // POST /admin/products/{product_id}/images
  //
  // Le endpoint FastAPI est déclaré SANS slash final :
  // @router.post("/{product_id}/images")
  // --------------------------------------------------

  const isProductImagesUpload =
    req.method === "POST" &&
    targetPath.endsWith("/images");

  // --------------------------------------------------
  // URL du backend
  //
  // Pour /images : pas de slash final.
  // Pour tout le reste : on conserve le slash final.
  // --------------------------------------------------

  const targetUrl =
    `${BACKEND_URL}/api/v1/${targetPath}${
      isProductImagesUpload ? "" : "/"
    }` + search;

  // --------------------------------------------------
  // Récupération du token depuis le cookie httpOnly
  // --------------------------------------------------

  const token = await getSessionToken();

  // --------------------------------------------------
  // Type du contenu envoyé par le navigateur
  // --------------------------------------------------

  const contentType =
    req.headers.get("content-type") || "";

  // --------------------------------------------------
  // Headers à transmettre au backend
  // --------------------------------------------------

  const forwardHeaders: Record<string, string> = {};

  if (contentType) {
    forwardHeaders["Content-Type"] = contentType;
  }

  if (token) {
    forwardHeaders["Authorization"] = `Bearer ${token}`;
  }

  // --------------------------------------------------
  // Initialisation de la requête backend
  // --------------------------------------------------

  const init: RequestInit = {
    method: req.method,
    headers: forwardHeaders,
  };

  // --------------------------------------------------
  // GET et HEAD n'ont normalement pas de body
  // --------------------------------------------------

  if (req.method !== "GET" && req.method !== "HEAD") {
    // ==================================================
    // JSON
    // ==================================================

    if (contentType.includes("application/json")) {
      // On garde exactement le fonctionnement actuel
      // qui fonctionne pour les PUT/PATCH avec JSON.

      const body = await req.text();

      if (body) {
        init.body = body;
      }
    }

    // ==================================================
    // UPLOAD D'IMAGES D'UN PRODUIT EXISTANT
    // ==================================================

    else if (
      contentType.includes("multipart/form-data") &&
      isProductImagesUpload
    ) {
      // ------------------------------------------------
      // On lit le FormData envoyé par le navigateur.
      // ------------------------------------------------

      const incomingFormData = await req.formData();

      // Nouveau FormData qui sera envoyé à FastAPI.
      const outgoingFormData = new FormData();

      // ------------------------------------------------
      // On recopie chaque champ/fichier.
      // ------------------------------------------------

      for (const [key, value] of incomingFormData.entries()) {
        if (value instanceof File) {
          const fileBuffer = await value.arrayBuffer();

          const fileBlob = new Blob([fileBuffer], {
            type:
              value.type ||
              "application/octet-stream",
          });

          outgoingFormData.append(
            key,
            fileBlob,
            value.name
          );
        } else {
          outgoingFormData.append(key, value);
        }
      }

      // ------------------------------------------------
      // On envoie le nouveau FormData.
      // ------------------------------------------------

      init.body = outgoingFormData;

      // IMPORTANT :
      //
      // Le Content-Type original contient le boundary
      // généré par le navigateur.
      //
      // Comme on vient de créer un NOUVEAU FormData,
      // il faut laisser fetch générer son propre boundary.
      // ------------------------------------------------

      delete forwardHeaders["Content-Type"];
    }

    // ==================================================
    // AUTRES MULTIPART / FORMDATA
    // ==================================================

    else {
      // ⚠️ NE PAS MODIFIER
      //
      // La création d'un produit avec images fonctionne
      // avec cette méthode.

      init.body = req.body;

      // Nécessaire pour ReadableStream avec fetch
      // côté serveur Node.js.

      (init as any).duplex = "half";
    }
  }

  // --------------------------------------------------
  // Logs de debug
  // --------------------------------------------------

  console.log("➡️ Backend URL:", targetUrl);
  console.log("➡️ Method:", req.method);
  console.log("➡️ Content-Type:", contentType);
  console.log(
    "➡️ Forwarded Content-Type:",
    forwardHeaders["Content-Type"] ||
      "(generated by fetch)"
  );
  console.log("➡️ Has body:", !!req.body);

  // --------------------------------------------------
  // Appel du backend FastAPI
  // --------------------------------------------------

  let backendRes: Response;

  try {
    backendRes = await fetch(targetUrl, init);

    console.log(
      "✅ Backend response:",
      backendRes.status
    );
  } catch (error) {
    console.error("❌ Backend fetch failed");
    console.error("URL:", targetUrl);
    console.error("Method:", req.method);
    console.error("Content-Type:", contentType);
    console.error("Error:", error);

    throw error;
  }

  // --------------------------------------------------
  // Transmettre le Content-Type de la réponse FastAPI
  // --------------------------------------------------

  const resHeaders = new Headers();

  const resContentType =
    backendRes.headers.get("content-type");

  if (resContentType) {
    resHeaders.set(
      "content-type",
      resContentType
    );
  }

  // --------------------------------------------------
  // Transmettre le body de FastAPI au client
  // --------------------------------------------------
// 204 No Content ne doit jamais avoir de body
if (backendRes.status === 204) {
  return new NextResponse(null, {
    status: 204,
  });
}

const body = await backendRes.arrayBuffer();

return new NextResponse(body, {
  status: backendRes.status,
  headers: resHeaders,
});}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};