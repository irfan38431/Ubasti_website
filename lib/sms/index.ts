import type { SmsProvider } from "./provider";
import { DevProvider } from "./dev";
import { Msg91Provider } from "./msg91";
import { TwilioProvider } from "./twilio";

let _provider: SmsProvider | null = null;

export function getSmsProvider(): SmsProvider {
  if (_provider) return _provider;

  const which = process.env.SMS_PROVIDER ?? "dev";

  if (which === "msg91") {
    _provider = new Msg91Provider();
  } else if (which === "twilio") {
    _provider = new TwilioProvider();
  } else {
    _provider = new DevProvider();
  }

  return _provider;
}

export type { SmsProvider, SmsTemplateKey } from "./provider";
