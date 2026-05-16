import { NextRequest, NextResponse } from "next/server";
import { getSession, clearSessionCookie } from "@/lib/auth/session";
import { audit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  const res = NextResponse.json({ ok: true });

  if (session) {
    await audit({
      actorUserId: session.sub,
      action:      "auth.logout",
      ipAddress:   req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    });
  }

  return clearSessionCookie(res);
}
