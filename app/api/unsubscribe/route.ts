import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { emailSubscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) {
    return new NextResponse("Missing unsubscribe token.", { status: 400, headers: { "Content-Type": "text/plain" } });
  }

  const rows = await db.select({ id: emailSubscriptions.id })
    .from(emailSubscriptions).where(eq(emailSubscriptions.token, token)).limit(1);

  if (rows.length === 0) {
    return new NextResponse("Invalid or already used token.", { status: 404, headers: { "Content-Type": "text/plain" } });
  }

  await db.update(emailSubscriptions)
    .set({ status: "unsubscribed", unsubscribedAt: new Date() })
    .where(eq(emailSubscriptions.token, token));

  return new NextResponse("You have been unsubscribed. You will no longer receive emails from Ubasti Cat Café.", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
