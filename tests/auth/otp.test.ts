import { describe, it, expect } from "vitest";
import { generateOtp, hashOtp, verifyOtp, otpExpiresAt } from "@/lib/auth/otp";

describe("generateOtp", () => {
  it("is always 6 characters", () => {
    for (let i = 0; i < 50; i++) {
      expect(generateOtp()).toHaveLength(6);
    }
  });

  it("is zero-padded (matches /^\\d{6}$/)", () => {
    for (let i = 0; i < 50; i++) {
      expect(generateOtp()).toMatch(/^\d{6}$/);
    }
  });
});

describe("otpExpiresAt", () => {
  it("is ~5 minutes in the future", () => {
    const before = Date.now();
    const exp = otpExpiresAt().getTime();
    const after = Date.now();
    expect(exp).toBeGreaterThanOrEqual(before + 4 * 60 * 1000);
    expect(exp).toBeLessThanOrEqual(after + 5 * 60 * 1000 + 100);
  });
});

describe("hashOtp / verifyOtp", () => {
  it("round-trips correctly", async () => {
    const code = "123456";
    const hash = await hashOtp(code);
    expect(await verifyOtp(code, hash)).toBe(true);
  });

  it("rejects wrong code", async () => {
    const hash = await hashOtp("111111");
    expect(await verifyOtp("999999", hash)).toBe(false);
  });

  it("hashes the code, not a token — hash differs each call", async () => {
    const code = "555555";
    const h1 = await hashOtp(code);
    const h2 = await hashOtp(code);
    expect(h1).not.toBe(h2); // argon2 uses random salt
    expect(await verifyOtp(code, h1)).toBe(true);
    expect(await verifyOtp(code, h2)).toBe(true);
  });
});
