import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { emailSubscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const existing = await db.select({ id: emailSubscriptions.id, status: emailSubscriptions.status })
      .from(emailSubscriptions).where(eq(emailSubscriptions.email, email.toLowerCase().trim())).limit(1);

    if (existing.length > 0) {
      if (existing[0].status === "active") {
        return NextResponse.json({ message: "Already subscribed" });
      }
      // Resubscribe
      await db.update(emailSubscriptions)
        .set({ status: "active", unsubscribedAt: null, name: name?.trim() || undefined })
        .where(eq(emailSubscriptions.email, email.toLowerCase().trim()));
      return NextResponse.json({ message: "Subscribed successfully" });
    }

    await db.insert(emailSubscriptions).values({
      email: email.toLowerCase().trim(),
      name:  name?.trim() || null,
      token: randomUUID(),
    });
    return NextResponse.json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
