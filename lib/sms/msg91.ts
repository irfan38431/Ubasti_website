import type { SmsProvider, SmsTemplateKey } from "./provider";
import { templateEnvKey } from "./templates";

const BASE_OTP    = "https://control.msg91.com/api/v5/otp";
const BASE_FLOW   = "https://control.msg91.com/api/v5/flow";
const RETRY_DELAY = 30_000;

async function post(url: string, body: unknown, authKey: string) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authkey: authKey,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`MSG91 error ${res.status}: ${text}`);
  }
  return res.json();
}

async function postWithRetry(url: string, body: unknown, authKey: string) {
  try {
    return await post(url, body, authKey);
  } catch {
    await new Promise((r) => setTimeout(r, RETRY_DELAY));
    return await post(url, body, authKey);
  }
}

export class Msg91Provider implements SmsProvider {
  private authKey: string;
  private senderId: string;
  private otpTemplateId: string;

  constructor() {
    this.authKey       = process.env.MSG91_AUTH_KEY!;
    this.senderId      = process.env.MSG91_SENDER_ID ?? "UBASTI";
    this.otpTemplateId = process.env.MSG91_TEMPLATE_ID_OTP!;
    if (!this.authKey) throw new Error("MSG91_AUTH_KEY not set");
  }

  async sendOtp(phoneE164: string, code: string) {
    // MSG91 OTP API requires mobile without leading +
    const mobile = phoneE164.replace(/^\+/, "");
    const data = await postWithRetry(
      `${BASE_OTP}?template_id=${this.otpTemplateId}&mobile=${mobile}&authkey=${this.authKey}&otp=${code}`,
      {},
      this.authKey
    );
    return { providerMessageId: data.request_id ?? "msg91-otp" };
  }

  async sendTransactional(
    phoneE164: string,
    templateKey: SmsTemplateKey,
    variables: Record<string, string>
  ) {
    const templateId = process.env[templateEnvKey(templateKey)];
    if (!templateId) {
      throw new Error(`MSG91 template ID not set for ${templateKey}`);
    }
    const mobile = phoneE164.replace(/^\+/, "");
    const data = await postWithRetry(
      BASE_FLOW,
      {
        template_id: templateId,
        sender:      this.senderId,
        mobiles:     mobile,
        ...variables,
      },
      this.authKey
    );
    return { providerMessageId: data.request_id ?? "msg91-flow" };
  }
}
