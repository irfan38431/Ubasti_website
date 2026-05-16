export interface SmsProvider {
  sendOtp(
    phoneE164: string,
    code: string
  ): Promise<{ providerMessageId: string }>;

  sendTransactional(
    phoneE164: string,
    templateKey: SmsTemplateKey,
    variables: Record<string, string>
  ): Promise<{ providerMessageId: string }>;
}

export type SmsTemplateKey =
  | "BOOKING_CONFIRM"
  | "BOOKING_CANCEL"
  | "BOOKING_REMINDER"
  | "EVENT_CONFIRM";
