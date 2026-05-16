import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { auditLog, users } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { eq, like, gte, lte, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try { requireAdmin(req); } catch (e) { return e as NextResponse; }

  const { searchParams } = req.nextUrl;
  const action = searchParams.get("action");
  const from   = searchParams.get("from");
  const to     = searchParams.get("to");
  const page   = Math.max(0, parseInt(searchParams.get("page") ?? "0"));
  const limit  = 50;

  try {
    const conditions = [];
    if (action) conditions.push(like(auditLog.action, `%${action}%`));
    if (from)   conditions.push(gte(auditLog.createdAt, new Date(from)));
    if (to)     conditions.push(lte(auditLog.createdAt, new Date(to)));

    const rows = await db.select({
      id:          auditLog.id,
      action:      auditLog.action,
      targetType:  auditLog.targetType,
      targetId:    auditLog.targetId,
      payload:     auditLog.payload,
      ipAddress:   auditLog.ipAddress,
      createdAt:   auditLog.createdAt,
      actorName:   users.displayName,
      actorPhone:  users.phoneE164,
    }).from(auditLog)
      .leftJoin(users, eq(auditLog.actorUserId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(auditLog.createdAt))
      .limit(limit)
      .offset(page * limit);

    return NextResponse.json({ entries: rows, page, limit });
  } catch (err) {
    console.error("[admin/audit]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
