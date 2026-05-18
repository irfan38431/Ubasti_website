import nodemailer from "nodemailer";
import { Resend } from "resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

function getGmailTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const gmail = getGmailTransport();
  if (gmail) {
    await gmail.sendMail({
      from: `Ubasti Cat Cafe <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return;
  }

  const resend = getResend();
  const from = process.env.EMAIL_FROM ?? "Ubasti Cat Cafe <hello@ubasticats.com>";
  if (resend) {
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) throw new Error(`Resend error: ${error.message}`);
    return;
  }

  console.log(`\n[EMAIL DEV] To: ${to}\nSubject: ${subject}\n${html}\n`);
}
