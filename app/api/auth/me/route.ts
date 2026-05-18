import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // Re-verify isAdmin from DB on every call — revocation takes effect immediately
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.sub),
    columns: { id: true, displayName: true, isAdmin: true, phoneE164: true, email: true },
  });

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
