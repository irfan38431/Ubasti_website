import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { eq } from "drizzle-orm";
import { audit } from "@/lib/audit";

interface Ctx { params: Promise<{ id: string }> }

export async function DELETE(req: NextRequest, ctx: Ctx) {
  let adminId: string;
  try { adminId = requireAdmin(req); } catch (e) { return e as NextResponse; }
  const { id } = await ctx.params;

  if (id === adminId) {
    return NextResponse.json({ error: "You cannot remove yourself" }, { status: 400 });
  }

  try {
    const [target] = await db.select({ isRootAdmin: users.isRootAdmin }).from(users).where(eq(users.id, id)).limit(1);
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (target.isRootAdmin) return NextResponse.json({ error: "Cannot remove root admin" }, { status: 403 });

    await db.update(users).set({ isAdmin: false }).where(eq(users.id, id));
    void audit({ actorUserId: adminId, action: "admin.team.remove", targetType: "user", targetId: id });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
