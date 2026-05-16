import type { SmsProvider, SmsTemplateKey } from "./provider";
import { devTemplates, interpolate } from "./templates";

export class DevProvider implements SmsProvider {
  async sendOtp(phoneE164: string, code: string) {
    console.log(`[DEV-SMS] OTP to ${phoneE164}: ${code}`);
    return { providerMessageId: `dev-otp-${Date.now()}` };
  }

  async sendTransactional(
    phoneE164: string,
    templateKey: SmsTemplateKey,
    variables: Record<string, string>
  ) {
    const body = interpolate(devTemplates[templateKey], variables);
    console.log(`[DEV-SMS] ${templateKey} to ${phoneE164}: ${body}`);
    return { providerMessageId: `dev-${templateKey.toLowerCase()}-${Date.now()}` };
  }
}
