import type { SmsProvider, SmsTemplateKey } from "./provider";
import { devTemplates, interpolate } from "./templates";

export class TwilioProvider implements SmsProvider {
  private accountSid: string;
  private authToken: string;
  private verifySid: string;
  private fromNumber: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID!;
    this.authToken  = process.env.TWILIO_AUTH_TOKEN!;
    this.verifySid  = process.env.TWILIO_VERIFY_SID!;
    this.fromNumber = process.env.TWILIO_FROM_NUMBER!;
    if (!this.accountSid || !this.authToken) {
      throw new Error("TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN not set");
    }
  }

  private get basicAuth() {
    return Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64");
  }

  // Twilio Verify generates and sends the code — we ignore the code param
  async sendOtp(phoneE164: string) {
    // Use Twilio Verify — the service generates and sends the code itself
    const res = await fetch(
      `https://verify.twilio.com/v2/Services/${this.verifySid}/Verifications`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${this.basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: phoneE164, Channel: "sms" }),
      }
    );
    if (!res.ok) throw new Error(`Twilio Verify error ${res.status}`);
    const data = await res.json();
    return { providerMessageId: data.sid };
  }

  async sendTransactional(
    phoneE164: string,
    templateKey: SmsTemplateKey,
    variables: Record<string, string>
  ) {
    const body = interpolate(devTemplates[templateKey], variables);
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${this.basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: phoneE164, From: this.fromNumber, Body: body }),
      }
    );
    if (!res.ok) throw new Error(`Twilio SMS error ${res.status}`);
    const data = await res.json();
    return { providerMessageId: data.sid };
  }
}
