import { describe, it, expect, beforeAll } from "vitest";
import { signSession, verifySession, shouldRefresh } from "@/lib/auth/session";

beforeAll(() => {
  process.env.SESSION_SECRET = "test-secret-must-be-at-least-32-chars-long!!";
  process.env.SESSION_COOKIE_NAME = "ubasti_session";
  // NODE_ENV is read-only in TypeScript types — set via vitest env config instead
});

describe("signSession / verifySession", () => {
  it("round-trips a valid session", async () => {
    const token = await signSession({ sub: "user-123", isAdmin: false });
    const payload = await verifySession(token);
    expect(payload?.sub).toBe("user-123");
    expect(payload?.isAdmin).toBe(false);
  });

  it("includes isAdmin=true for admins", async () => {
    const token = await signSession({ sub: "admin-456", isAdmin: true });
    const payload = await verifySession(token);
    expect(payload?.isAdmin).toBe(true);
  });

  it("rejects a tampered token", async () => {
    const token = await signSession({ sub: "user-789", isAdmin: false });
    const tampered = token.slice(0, -4) + "xxxx";
    const payload = await verifySession(tampered);
    expect(payload).toBeNull();
  });

  it("rejects a garbage string", async () => {
    const payload = await verifySession("not.a.jwt");
    expect(payload).toBeNull();
  });
});

describe("shouldRefresh", () => {
  it("returns false for a brand-new token", async () => {
    const token = await signSession({ sub: "u1", isAdmin: false });
    const payload = (await verifySession(token))!;
    expect(shouldRefresh(payload)).toBe(false);
  });

  it("returns true for a token older than 7 days", async () => {
    const oldIat = Math.floor(Date.now() / 1000) - 8 * 24 * 60 * 60;
    const fakePayload = { sub: "u2", isAdmin: false, iat: oldIat, exp: oldIat + 30 * 86400 } as import("@/lib/auth/session").SessionPayload;
    expect(shouldRefresh(fakePayload)).toBe(true);
  });
});
