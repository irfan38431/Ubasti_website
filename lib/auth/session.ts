import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME  = process.env.SESSION_COOKIE_NAME ?? "ubasti_session";
const EXPIRY_DAYS  = 30;
const REFRESH_DAYS = 7;

interface SessionPayload extends JWTPayload {
  sub: string;        // user id
  isAdmin: boolean;
}

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET not set");
  return new TextEncoder().encode(s);
}

export async function signSession(payload: { sub: string; isAdmin: boolean }) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRY_DAYS}d`)
    .sign(secret());
}

export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/** Read session from the incoming request cookie. */
export async function getSession(
  req: NextRequest
): Promise<SessionPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Write a session cookie onto a response (or create a new one). */
export function setSessionCookie(
  res: NextResponse,
  token: string
): NextResponse {
  res.cookies.set({
    name:     COOKIE_NAME,
    value:    token,
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   EXPIRY_DAYS * 24 * 60 * 60,
    path:     "/",
  });
  return res;
}

export function clearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set({
    name:     COOKIE_NAME,
    value:    "",
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   0,
    path:     "/",
  });
  return res;
}

/** Returns true if the session is older than REFRESH_DAYS and should be reissued. */
export function shouldRefresh(payload: SessionPayload): boolean {
  const iat = payload.iat ?? 0;
  return Date.now() / 1000 - iat > REFRESH_DAYS * 24 * 60 * 60;
}

export type { SessionPayload };
export { COOKIE_NAME };
