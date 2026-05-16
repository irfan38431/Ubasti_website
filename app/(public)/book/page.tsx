import { Suspense } from "react";
import { BookWizard } from "./BookWizard";
import { getBookableDates } from "@/lib/booking/slots";

export const metadata = { title: "Book a Session — Ubasti" };

export default async function BookPage() {
  let dates: string[] = [];
  try { dates = getBookableDates(); } catch {}

  return (
    <div
      className="min-h-screen py-16 px-4"
      style={{ background: "var(--ubasti-paper)" }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <p
            className="text-sm font-bold uppercase tracking-widest mb-2"
            style={{ color: "var(--ubasti-mustard)" }}
          >
            Book a Session
          </p>
          <h1
            className="text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
          >
            Reserve Your Hour
          </h1>
          <p className="text-sm mt-3" style={{ color: "var(--ubasti-sage)" }}>
            60-minute lounge sessions · Pay on arrival · Cancel up to 24h before
          </p>
        </div>

        <Suspense fallback={<div className="h-64 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-cream)" }} />}>
          <BookWizard dates={dates} />
        </Suspense>
      </div>
    </div>
  );
}
