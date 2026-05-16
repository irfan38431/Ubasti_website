import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { contactSubmissions } from "@/lib/db/schema";
import { audit } from "@/lib/audit";

const bodySchema = z.object({
  name:    z.string().min(1).max(100),
  email:   z.string().email().optional().or(z.literal("")),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await db.insert(contactSubmissions).values({
    name:    body.name,
    email:   body.email || null,
    message: body.message,
  });

  await audit({ action: "contact.submit", payload: { name: body.name } });

  return NextResponse.json({ ok: true });
}
