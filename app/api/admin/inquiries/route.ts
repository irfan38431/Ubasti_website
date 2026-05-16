import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { privatePartyInquiries } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { eq, desc } from "drizzle-orm";
import { audit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try { requireAdmin(req); } catch (e) { return e as NextResponse; }

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status"); // new | contacted | booked | declined | expired | all

  try {
    let rows = await db.select().from(privatePartyInquiries).orderBy(desc(privatePartyInquiries.createdAt)).limit(100);
    if (status && status !== "all") {
      rows = rows.filter((r) => r.status === status);
    }
    return NextResponse.json({ inquiries: rows });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  let adminId: string;
  try { adminId = requireAdmin(req); } catch (e) { return e as NextResponse; }

  try {
    const { id, status, adminNotes } = await req.json() as { id?: string; status?: string; adminNotes?: string };
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const VALID = ["new", "contacted", "booked", "declined", "expired"];
    if (status && !VALID.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    const update: Partial<typeof privatePartyInquiries.$inferInsert> = {};
    if (status     !== undefined) update.status     = status;
    if (adminNotes !== undefined) update.adminNotes = adminNotes;
    if (adminId)                  update.handledBy  = adminId;

    await db.update(privatePartyInquiries).set(update).where(eq(privatePartyInquiries.id, id));
    void audit({ actorUserId: adminId, action: "admin.inquiry.update", targetType: "inquiry", targetId: id, payload: update as Record<string, unknown> });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/inquiries PATCH]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
