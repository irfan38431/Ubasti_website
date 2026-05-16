import type { SmsProvider } from "./provider";
import { DevProvider } from "./dev";
import { WhatsAppProvider } from "./whatsapp";

let _provider: SmsProvider | null = null;

export function getSmsProvider(): SmsProvider {
  if (_provider) return _provider;

  const which = process.env.SMS_PROVIDER ?? "dev";

  if (which === "whatsapp") {
    _provider = new WhatsAppProvider();
  } else {
    _provider = new DevProvider();
  }

  return _provider;
}

export type { SmsProvider, SmsTemplateKey } from "./provider";
