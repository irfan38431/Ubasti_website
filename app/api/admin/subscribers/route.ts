import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { emailSubscriptions } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try { requireAdmin(req); } catch (e) { return e as NextResponse; }

  const rows = await db.select().from(emailSubscriptions).orderBy(desc(emailSubscriptions.subscribedAt));
  return NextResponse.json({ subscribers: rows });
}

export async function DELETE(req: NextRequest) {
  try { requireAdmin(req); } catch (e) { return e as NextResponse; }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.update(emailSubscriptions).set({ status: "unsubscribed", unsubscribedAt: new Date() }).where(eq(emailSubscriptions.id, id));
  return NextResponse.json({ ok: true });
}
