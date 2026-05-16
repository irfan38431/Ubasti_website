import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Sign In",
  description: "Sign in to your Ubasti account to manage bookings.",
  path: "/login",
  noindex: true,
});

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "var(--ubasti-paper)" }}
        >
          <p style={{ color: "var(--ubasti-sage)", fontFamily: "var(--font-cinzel)" }}>
            Loading…
          </p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
