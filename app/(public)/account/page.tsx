export const metadata = { title: "My Account — Ubasti" };

export default function AccountPage() {
  return (
    <div className="min-h-screen py-20 px-6" style={{ background: "var(--ubasti-paper)" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl mb-4"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
          My Account
        </h1>
        <p style={{ color: "var(--ubasti-sage)" }}>Booking management coming in Phase 5.</p>
      </div>
    </div>
  );
}
