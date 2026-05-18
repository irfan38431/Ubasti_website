import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";
import { audit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "key param required" }, { status: 400 });
  }

  const row = await db.query.siteSettings.findFirst({
    where: (s, { eq }) => eq(s.key, key),
  });

  return NextResponse.json({ key, value: row?.value ?? null });
}

export async function PATCH(req: NextRequest) {
  const actorUserId = req.headers.get("x-user-id") ?? undefined;

  let body: { key: string; value: unknown };
  try {
    body = z.object({ key: z.string().min(1), value: z.unknown() }).parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  await db
    .insert(siteSettings)
    .values({ key: body.key, value: body.value as Record<string, unknown>, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set:    { value: body.value as Record<string, unknown>, updatedAt: new Date() },
    });

  await audit({
    actorUserId,
    action:     "settings.update",
    targetType: "site_settings",
    targetId:   body.key,
  });

  return NextResponse.json({ ok: true });
}
