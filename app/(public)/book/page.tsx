export const metadata = { title: "Book a Session — Ubasti" };

export default function BookPage() {
  return (
    <div className="min-h-screen py-20 px-6 flex items-center justify-center"
      style={{ background: "var(--ubasti-paper)" }}>
      <div className="text-center">
        <h1 className="text-4xl mb-4"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
          Book a Session
        </h1>
        <p style={{ color: "var(--ubasti-sage)" }}>Full booking flow coming in Phase 5.</p>
      </div>
    </div>
  );
}
