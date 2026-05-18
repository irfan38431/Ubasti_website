import { NextRequest, NextResponse } from "next/server";
import * as argon2 from "argon2";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { signSession, setSessionCookie } from "@/lib/auth/session";
import { audit } from "@/lib/audit";

const bodySchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  let body: { email: string; password: string };
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, body.email.toLowerCase()),
  });

  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  if (!user.isAdmin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  let passwordMatch = false;
  try {
    passwordMatch = await argon2.verify(user.passwordHash, body.password);
  } catch {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  if (!passwordMatch) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  const token = await signSession({ sub: user.id, isAdmin: user.isAdmin });

  await audit({
    actorUserId: user.id,
    action:      "auth.login",
    targetType:  "email",
    targetId:    user.email ?? undefined,
    ipAddress:   ip,
    userAgent:   req.headers.get("user-agent") ?? undefined,
  });

  const res = NextResponse.json({
    user: { id: user.id, displayName: user.displayName, isAdmin: user.isAdmin },
  });
  return setSessionCookie(res, token);
}
