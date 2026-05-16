import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function makeRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// In-memory fallback map for dev (resets on cold start — fine for local dev)
const devHits = new Map<string, { count: number; resetAt: number }>();

function devCheck(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = devHits.get(key);
  if (!entry || entry.resetAt < now) {
    devHits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export type RateLimitResult = { success: boolean; remaining?: number };

let _sendByPhone: Ratelimit | null = null;
let _sendByIp:    Ratelimit | null = null;
let _verifyPhone: Ratelimit | null = null;
let _contactIp:   Ratelimit | null = null;
let _inquiryIp:   Ratelimit | null = null;

function getLimiters() {
  const redis = makeRedis();
  if (!redis) return null;
  _sendByPhone ??= new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3,  "15m"), prefix: "rl:otp:phone" });
  _sendByIp    ??= new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1h"),  prefix: "rl:otp:ip" });
  _verifyPhone ??= new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "15m"), prefix: "rl:verify:phone" });
  _contactIp   ??= new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1h"),  prefix: "rl:contact:ip" });
  _inquiryIp   ??= new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5,  "1h"),  prefix: "rl:inquiry:ip" });
  return { sendByPhone: _sendByPhone, sendByIp: _sendByIp, verifyPhone: _verifyPhone, contactIp: _contactIp, inquiryIp: _inquiryIp };
}

export async function checkSendOtpLimits(
  phoneE164: string,
  ip: string
): Promise<RateLimitResult> {
  const limiters = getLimiters();
  if (!limiters) {
    // Dev fallback
    const byPhone = devCheck(`phone:${phoneE164}`, 3, 15 * 60 * 1000);
    const byIp    = devCheck(`ip:${ip}`, 10, 60 * 60 * 1000);
    return { success: byPhone && byIp };
  }
  const [byPhone, byIp] = await Promise.all([
    limiters.sendByPhone.limit(phoneE164),
    limiters.sendByIp.limit(ip),
  ]);
  return { success: byPhone.success && byIp.success };
}

export async function checkVerifyOtpLimit(
  phoneE164: string
): Promise<RateLimitResult> {
  const limiters = getLimiters();
  if (!limiters) {
    return { success: devCheck(`verify:${phoneE164}`, 10, 15 * 60 * 1000) };
  }
  const result = await limiters.verifyPhone.limit(phoneE164);
  return { success: result.success, remaining: result.remaining };
}

export async function checkContactLimit(ip: string): Promise<RateLimitResult> {
  const limiters = getLimiters();
  if (!limiters) return { success: devCheck(`contact:${ip}`, 10, 60 * 60 * 1000) };
  const result = await limiters.contactIp.limit(ip);
  return { success: result.success };
}

export async function checkInquiryLimit(ip: string): Promise<RateLimitResult> {
  const limiters = getLimiters();
  if (!limiters) return { success: devCheck(`inquiry:${ip}`, 5, 60 * 60 * 1000) };
  const result = await limiters.inquiryIp.limit(ip);
  return { success: result.success };
}
