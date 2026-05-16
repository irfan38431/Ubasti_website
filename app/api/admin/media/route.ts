import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { mediaLibrary } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { desc, eq } from "drizzle-orm";
import { audit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try { requireAdmin(req); } catch (e) { return e as NextResponse; }
  try {
    const rows = await db.select().from(mediaLibrary).orderBy(desc(mediaLibrary.createdAt)).limit(200);
    return NextResponse.json({ media: rows });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  let adminId: string;
  try { adminId = requireAdmin(req); } catch (e) { return e as NextResponse; }
  try {
    const { id } = await req.json() as { id?: string };
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.delete(mediaLibrary).where(eq(mediaLibrary.id, id));
    void audit({ actorUserId: adminId, action: "admin.media.delete", targetType: "media", targetId: id });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
