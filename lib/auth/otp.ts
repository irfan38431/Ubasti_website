import * as argon2 from "argon2";
import { randomInt } from "crypto";

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS  = 5;

/** Generates a 6-digit OTP, zero-padded (e.g. "042731"). */
export function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function otpExpiresAt(): Date {
  return new Date(Date.now() + OTP_EXPIRY_MS);
}

/** Hashes an OTP with argon2id. Never store plain codes. */
export async function hashOtp(code: string): Promise<string> {
  return argon2.hash(code, { type: argon2.argon2id });
}

/** Constant-time verify. Returns true if code matches hash. */
export async function verifyOtp(code: string, hash: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, code);
  } catch {
    return false;
  }
}

export { MAX_ATTEMPTS };
