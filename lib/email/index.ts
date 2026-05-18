import { Resend } from "resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

let _resend: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_resend) _resend = new Resend(key);
  return _resend;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const resend = getResend();
  const from = process.env.EMAIL_FROM ?? "Ubasti Cat Cafe <hello@ubasticats.com>";

  if (!resend) {
    console.log(`\n[EMAIL DEV] To: ${to}\nSubject: ${subject}\n${html}\n`);
    return;
  }

  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) throw new Error(`Resend error: ${error.message}`);
}
