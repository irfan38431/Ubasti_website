import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

/** Reads userId from the header set by middleware. Throws 401 response on failure. */
export function requireUser(req: NextRequest): string {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    throw NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  return userId;
}

/** Reads userId + isAdmin header. Throws 403 response if not admin. */
export function requireAdmin(req: NextRequest): string {
  const userId  = req.headers.get("x-user-id");
  const isAdmin = req.headers.get("x-is-admin");
  if (!userId || isAdmin !== "true") {
    throw NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  return userId;
}

/** DB-verified admin check — call on every admin route handler. */
export async function verifyAdmin(userId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { isAdmin: true },
  });
  return user?.isAdmin === true;
}
