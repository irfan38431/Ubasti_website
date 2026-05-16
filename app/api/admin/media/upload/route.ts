import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { mediaLibrary } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { audit } from "@/lib/audit";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX_BYTES    = 8 * 1024 * 1024; // 8 MB

export async function POST(req: NextRequest) {
  let adminId: string;
  try { adminId = requireAdmin(req); } catch (e) { return e as NextResponse; }

  const formData = await req.formData();
  const file     = formData.get("file") as File | null;
  const altText  = formData.get("altText") as string | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!ALLOWED_MIME.has(file.type)) return NextResponse.json({ error: "File type not allowed. Use JPEG/PNG/WebP." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File too large (max 8 MB)" }, { status: 400 });
  if (!altText?.trim()) return NextResponse.json({ error: "Alt text is required for accessibility" }, { status: 400 });

  try {
    // Lazy import to avoid breaking builds without Supabase keys
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl  = process.env.SUPABASE_URL;
    const serviceKey   = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
    }
    const supabase = createClient(supabaseUrl, serviceKey);

    const ext      = file.name.split(".").pop() ?? "bin";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer   = Buffer.from(await file.arrayBuffer());

    const { error: upErr, data } = await supabase.storage
      .from("ubasti-media")
      .upload(filename, buffer, { contentType: file.type, upsert: false });

    if (upErr) {
      console.error("[media/upload] Supabase error:", upErr);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from("ubasti-media").getPublicUrl(data.path);

    const [row] = await db.insert(mediaLibrary).values({
      url:         publicUrl,
      altText:     altText.trim(),
      sizeBytes:   file.size,
      mimeType:    file.type,
      uploadedBy:  adminId,
    }).returning();

    void audit({ actorUserId: adminId, action: "admin.media.upload", targetType: "media", targetId: row.id });
    return NextResponse.json({ media: row }, { status: 201 });
  } catch (err) {
    console.error("[media/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
