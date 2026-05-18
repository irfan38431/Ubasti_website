import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import { BoardingWizard } from "./BoardingWizard";

export const metadata = buildMetadata({
  title: "Book Cat Boarding — Ubasti",
  description: "Book a boarding stay for your cat at Ubasti Cat Cafe in Chennai.",
  path: "/boarding/book",
});

export default function BoardingBookPage() {
  return (
    <div className="min-h-screen py-16 px-4" style={{ background: "var(--ubasti-paper)" }}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <p
            className="text-sm font-bold uppercase tracking-widest mb-2"
            style={{ color: "var(--ubasti-mustard)" }}
          >
            Cat Boarding
          </p>
          <h1
            className="text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
          >
            Book a Stay
          </h1>
          <p className="text-sm mt-3" style={{ color: "var(--ubasti-sage)" }}>
            Deposit required to confirm · Balance paid at check-in · Pick up during business hours
          </p>
        </div>

        <Suspense fallback={<div className="h-64 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-cream)" }} />}>
          <BoardingWizard />
        </Suspense>
      </div>
    </div>
  );
}
