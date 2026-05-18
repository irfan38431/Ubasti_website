import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { kitties } from "@/lib/db/schema";
import { audit } from "@/lib/audit";
import { asc } from "drizzle-orm";

const createSchema = z.object({
  slug:        z.string().min(1).regex(/^[a-z0-9-]+$/),
  name:        z.string().min(1),
  age:         z.string().optional(),
  sex:         z.string().optional(),
  personality: z.string().optional(),
  bio:         z.string().optional(),
  imageUrl:    z.string().optional(),
  status:      z.enum(["available", "on-hold", "reserved", "adopted"]).default("available"),
  sortOrder:   z.number().int().default(0),
});

export async function GET() {
  const rows = await db
    .select()
    .from(kitties)
    .orderBy(asc(kitties.sortOrder), asc(kitties.name));
  return NextResponse.json({ kitties: rows });
}

export async function POST(req: NextRequest) {
  const actorUserId = req.headers.get("x-user-id") ?? undefined;

  let body: z.infer<typeof createSchema>;
  try {
    body = createSchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const [kitty] = await db
    .insert(kitties)
    .values({ ...body, updatedAt: new Date() })
    .returning();

  await audit({
    actorUserId,
    action:     "kitty.create",
    targetType: "kitty",
    targetId:   kitty.id,
    payload:    { name: kitty.name },
  });

  return NextResponse.json({ kitty }, { status: 201 });
}
