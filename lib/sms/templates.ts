import type { SmsTemplateKey } from "./provider";

/** Interpolates {variable} placeholders in a template string. */
export function interpolate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

/** Human-readable fallback bodies used only by DevProvider. */
export const devTemplates: Record<SmsTemplateKey, string> = {
  BOOKING_CONFIRM:
    "Hi {name}, your Ubasti session is confirmed for {datetime}. See you at {address}. Cancel: {url}",
  BOOKING_CANCEL:
    "Hi {name}, your Ubasti session for {datetime} has been cancelled. Book again: {url}",
  BOOKING_REMINDER:
    "Reminder: your Ubasti session is tomorrow at {time}. See you soon!",
  EVENT_CONFIRM:
    "Hi {name}, you're registered for {event_title} on {datetime} at Ubasti. Details: {url}",
  ADOPTION_CHECKUP:
    "Hi {adopter_name}, it's been {interval_label} since you welcomed {cat_name} home! How are they doing? We'd love to see a photo 🐾",
};

/**
 * Ordered variable keys for each WhatsApp template.
 * Must match the {{1}}, {{2}}, … parameter positions in your approved Meta templates.
 */
export const whatsappTemplateParams: Record<SmsTemplateKey, string[]> = {
  BOOKING_CONFIRM:  ["name", "datetime", "address", "url"],
  BOOKING_CANCEL:   ["name", "datetime", "url"],
  BOOKING_REMINDER: ["time"],
  EVENT_CONFIRM:    ["name", "event_title", "datetime", "url"],
  ADOPTION_CHECKUP: ["adopter_name", "cat_name", "interval_label"],
};

/** Returns the env var name holding the WhatsApp template name for a given key. */
export function whatsappTemplateEnvKey(key: SmsTemplateKey): string {
  const map: Record<SmsTemplateKey, string> = {
    BOOKING_CONFIRM:  "WHATSAPP_TEMPLATE_BOOKING_CONFIRM",
    BOOKING_CANCEL:   "WHATSAPP_TEMPLATE_BOOKING_CANCEL",
    BOOKING_REMINDER: "WHATSAPP_TEMPLATE_REMINDER",
    EVENT_CONFIRM:    "WHATSAPP_TEMPLATE_EVENT_CONFIRM",
    ADOPTION_CHECKUP: "WHATSAPP_TEMPLATE_ADOPTION_CHECKUP",
  };
  return map[key];
}
