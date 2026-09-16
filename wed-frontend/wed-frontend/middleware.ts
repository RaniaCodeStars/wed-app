// middleware.ts
// Protège /admin/* : vérifie le JWT (cookie httpOnly "session") côté edge, sans appel
// réseau au backend. Rappel sécurité : ceci est un confort UX (redirection rapide) —
// le backend revérifie is_admin en base sur CHAQUE requête API (voir lib/session.ts).

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "session";

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET || "");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // La page de login admin elle-même doit rester accessible sans session
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, getSecret());
      if (!payload.is_admin) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
