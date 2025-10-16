// middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyJWTServer } from "@/lib//auth_JWT/verify_JWT";

const PUBLIC_ROUTES = ["/login", "/signup", "/"];
const PROTECTED_PREFIXES = ["/dashboard", "/plans"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value || "";

  if (PUBLIC_ROUTES.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  let session = null;

  try {
    session = await verifyJWTServer(token);
  } catch (err) {
    console.warn("JWT validation failed:", err);
  }  

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    req.nextUrl.pathname.startsWith(prefix)
  );

  const isPlans = PROTECTED_PREFIXES.some((prefix) =>
    req.nextUrl.pathname.startsWith(prefix)
  );

  if (isProtected && (!session || !session?.success)) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (isPlans && (!session || !session?.success)) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (isProtected && session && session.data.plan === null) {
    return NextResponse.redirect(new URL("/plans", req.url));
  }

  return NextResponse.next();
}
