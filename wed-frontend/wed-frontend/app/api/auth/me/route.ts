// app/api/auth/me/route.ts
// Petite route utilisée par les Client Components (ex: Navbar) pour savoir si une
// session est active, sans jamais exposer le token lui-même au JS du navigateur.
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ authenticated: false });
  return NextResponse.json({ authenticated: true, email: session.sub, is_admin: !!session.is_admin });
}
