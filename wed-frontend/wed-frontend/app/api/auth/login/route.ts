// app/api/auth/login/route.ts
// Proxie /auth/login vers le backend, puis pose le JWT reçu dans un cookie httpOnly
// (jamais accessible en JS côté navigateur -> protection contre le vol de token via XSS).

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // FastAPI /auth/login attend un formulaire OAuth2PasswordRequestForm
  // (application/x-www-form-urlencoded, champs "username"/"password")
  const form = new URLSearchParams();
  form.set("username", email);
  form.set("password", password);

  const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  // Décoder juste le payload (sans vérif, déjà signé par le backend) pour connaître is_admin
  const payloadB64 = data.access_token.split(".")[1];
  const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString("utf-8"));

  const response = NextResponse.json({ success: true, is_admin: !!payload.is_admin });
  response.cookies.set(SESSION_COOKIE, data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours, aligné sur ACCESS_TOKEN_EXPIRE_MINUTES backend
  });
  return response;
}
