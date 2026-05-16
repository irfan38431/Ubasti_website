import { headers } from "next/headers";
import { fetchPage } from "@/lib/cms/page-renderer";
import { BlocksRenderer } from "@/lib/cms/blocks-renderer";
import { PageEditorClient } from "@/components/admin/PageEditorClient";

export const metadata = { title: "Visitor Waiver — Ubasti Cat Cafe" };

interface Props { searchParams: Promise<Record<string, string>> }

export default async function WaiverPage({ searchParams }: Props) {
  const [hdrs, sp] = await Promise.all([headers(), searchParams]);
  const isAdmin  = hdrs.get("x-is-admin") === "true";
  const editMode = isAdmin && sp.edit === "1";

  const page = await fetchPage("waiver");

  if (page && (editMode || page.blocks.length > 0)) {
    const activeBlocks = editMode && page.draftBlocks ? page.draftBlocks : page.blocks;
    if (editMode) {
      return (
        <PageEditorClient
          slug="waiver"
          title={page.title}
          initialBlocks={activeBlocks}
          hasDraft={page.draftBlocks !== null}
        />
      );
    }
    return <BlocksRenderer blocks={activeBlocks} />;
  }

  // Static fallback
  return (
    <div style={{ background: "var(--ubasti-paper)" }}>
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl mb-8"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
          Visitor Waiver &amp; Code of Conduct
        </h1>
        <div className="prose prose-sm max-w-none space-y-6 text-base leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>
          <p className="text-sm uppercase tracking-widest font-bold" style={{ color: "var(--ubasti-mustard)" }}>
            Please read before your visit
          </p>
          {[
            { heading: "1. Respect the Cats", body: "The cats' comfort and safety are our top priority. Do not force interaction — let the cats approach you. Do not pick up, chase, or startle any cat. If a cat moves away, give it space." },
            { heading: "2. Hygiene", body: "Please wash your hands before and after interacting with the cats. Do not visit if you are unwell. Inform a team member if you have cat allergies — we can advise accordingly." },
            { heading: "3. Food & Drinks", body: "Only food and drinks purchased at the cafe may be consumed inside the lounge. Do not feed the cats human food under any circumstances — our team manages their diet carefully." },
            { heading: "4. Behaviour", body: "Loud noises, sudden movements, and rough handling are not permitted. Children under 7 require adult supervision at a ratio of 1 adult per 2 children. Ubasti reserves the right to ask any visitor to leave if the cats' wellbeing is at risk." },
            { heading: "5. Photography", body: "Photography for personal use is welcome. Flash photography is not permitted as it distresses the cats. Do not post images of other guests without their consent." },
            { heading: "6. Liability", body: "While we take every precaution to ensure a safe visit, Ubasti Cat Cafe & Lounge is not liable for allergic reactions, scratches, or other minor incidents that may occur during a visit. By entering the lounge, guests acknowledge and accept this." },
            { heading: "7. Booking & Cancellation", body: "Sessions are 60 minutes. Please arrive within 10 minutes of your booking time. Cancellations made more than 24 hours in advance are fully refunded or rescheduled. Late cancellations and no-shows forfeit the session." },
          ].map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl mb-2" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>{s.heading}</h2>
              <p>{s.body}</p>
            </section>
          ))}
          <p className="text-xs opacity-60 pt-4" style={{ borderTop: "1px solid var(--ubasti-blush-light)" }}>
            Last updated May 2026. By visiting Ubasti Cat Cafe &amp; Lounge you agree to this code of conduct.
          </p>
        </div>
      </div>
    </div>
  );
}
