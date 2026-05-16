import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/guards";

const schema = z.object({ displayName: z.string().min(1).max(80) });

export async function PATCH(req: NextRequest) {
  let userId: string;
  try { userId = requireUser(req); } catch (r) { return r as NextResponse; }

  let body: z.infer<typeof schema>;
  try { body = schema.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid" }, { status: 400 }); }

  await db.update(users).set({ displayName: body.displayName }).where(eq(users.id, userId));
  return NextResponse.json({ ok: true });
}
