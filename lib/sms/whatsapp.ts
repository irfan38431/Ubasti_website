import type { SmsProvider, SmsTemplateKey } from "./provider";
import { whatsappTemplateEnvKey, whatsappTemplateParams } from "./templates";

const GRAPH_API = "https://graph.facebook.com/v21.0";

async function callApi(phoneNumberId: string, token: string, body: unknown) {
  const res = await fetch(`${GRAPH_API}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WhatsApp API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<{ messages?: { id: string }[] }>;
}

export class WhatsAppProvider implements SmsProvider {
  private phoneNumberId: string;
  private accessToken: string;
  private otpTemplateName: string;

  constructor() {
    this.phoneNumberId  = process.env.WHATSAPP_PHONE_NUMBER_ID!;
    this.accessToken    = process.env.WHATSAPP_ACCESS_TOKEN!;
    this.otpTemplateName = process.env.WHATSAPP_TEMPLATE_OTP ?? "ubasti_otp";
    if (!this.phoneNumberId) throw new Error("WHATSAPP_PHONE_NUMBER_ID not set");
    if (!this.accessToken)  throw new Error("WHATSAPP_ACCESS_TOKEN not set");
  }

  async sendOtp(phoneE164: string, code: string) {
    const data = await callApi(this.phoneNumberId, this.accessToken, {
      messaging_product: "whatsapp",
      to: phoneE164,
      type: "template",
      template: {
        name: this.otpTemplateName,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text: code }],
          },
          // If your OTP template has a URL/copy button with the code, add:
          // { type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: code }] }
        ],
      },
    });
    return { providerMessageId: data.messages?.[0]?.id ?? "wa-otp" };
  }

  async sendTransactional(
    phoneE164: string,
    templateKey: SmsTemplateKey,
    variables: Record<string, string>
  ) {
    const templateName = process.env[whatsappTemplateEnvKey(templateKey)];
    if (!templateName) {
      throw new Error(`WhatsApp template name not set for ${templateKey}`);
    }

    const paramOrder = whatsappTemplateParams[templateKey];
    const parameters = paramOrder.map((key) => ({
      type: "text",
      text: variables[key] ?? "",
    }));

    const data = await callApi(this.phoneNumberId, this.accessToken, {
      messaging_product: "whatsapp",
      to: phoneE164,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [{ type: "body", parameters }],
      },
    });
    return { providerMessageId: data.messages?.[0]?.id ?? "wa-transactional" };
  }
}
