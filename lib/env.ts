import { z } from "zod";

const envSchema = z.object({
  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Database
  DATABASE_URL: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Auth
  SESSION_SECRET: z.string().min(32),
  SESSION_COOKIE_NAME: z.string().default("ubasti_session"),

  // Messaging (WhatsApp Business API via Meta Cloud API)
  SMS_PROVIDER: z.enum(["whatsapp", "dev"]).default("dev"),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: z.string().optional(),
  WHATSAPP_TEMPLATE_OTP: z.string().optional(),
  WHATSAPP_TEMPLATE_BOOKING_CONFIRM: z.string().optional(),
  WHATSAPP_TEMPLATE_BOOKING_CANCEL: z.string().optional(),
  WHATSAPP_TEMPLATE_REMINDER: z.string().optional(),
  WHATSAPP_TEMPLATE_EVENT_CONFIRM: z.string().optional(),

  // Rate limiting
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Seed
  SEED_ROOT_ADMIN_PHONE: z.string().default("+919445077270"),
  SEED_ROOT_ADMIN_NAME: z.string().default("Irfan"),

  // Cron
  CRON_SECRET: z.string().optional(),
});

// Only validate at runtime in server context (not during type generation)
function getEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Missing/invalid env vars: ${missing}`);
  }
  return parsed.data;
}

export type Env = z.infer<typeof envSchema>;

// Export a lazy singleton — throws on first access if env is invalid
let _env: Env | undefined;
export function env(): Env {
  if (!_env) _env = getEnv();
  return _env;
}
