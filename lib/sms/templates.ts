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
};

/** Returns the DLT template ID env var name for a given key. */
export function templateEnvKey(key: SmsTemplateKey): string {
  const map: Record<SmsTemplateKey, string> = {
    BOOKING_CONFIRM:  "MSG91_TEMPLATE_ID_BOOKING_CONFIRM",
    BOOKING_CANCEL:   "MSG91_TEMPLATE_ID_BOOKING_CANCEL",
    BOOKING_REMINDER: "MSG91_TEMPLATE_ID_REMINDER",
    EVENT_CONFIRM:    "MSG91_TEMPLATE_ID_EVENT_CONFIRM",
  };
  return map[key];
}
