import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import { GroomingWizard } from "./GroomingWizard";

export const metadata = buildMetadata({
  title: "Book Grooming — Ubasti",
  description: "Book a grooming or spa appointment for your pet at Ubasti, Chennai.",
  path: "/grooming/book",
});

export default function GroomingBookPage() {
  return (
    <div className="min-h-screen py-16 px-4" style={{ background: "var(--ubasti-paper)" }}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <p
            className="text-sm font-bold uppercase tracking-widest mb-2"
            style={{ color: "var(--ubasti-mustard)" }}
          >
            Grooming & Spa
          </p>
          <h1
            className="text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
          >
            Book an Appointment
          </h1>
          <p className="text-sm mt-3" style={{ color: "var(--ubasti-sage)" }}>
            Select your services · Choose a date · We'll call to confirm your time
          </p>
        </div>

        <Suspense fallback={<div className="h-64 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-cream)" }} />}>
          <GroomingWizard />
        </Suspense>
      </div>
    </div>
  );
}
