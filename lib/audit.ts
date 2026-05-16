import { db } from "./db/client";
import { auditLog } from "./db/schema";

interface AuditEntry {
  actorUserId?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  payload?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function audit(entry: AuditEntry): Promise<void> {
  try {
    await db.insert(auditLog).values({
      actorUserId: entry.actorUserId,
      action:      entry.action,
      targetType:  entry.targetType,
      targetId:    entry.targetId,
      payload:     entry.payload,
      ipAddress:   entry.ipAddress,
      userAgent:   entry.userAgent,
    });
  } catch (err) {
    // Audit failure must never break the main flow
    console.error("[audit] failed to write:", err);
  }
}
