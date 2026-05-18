import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: { user, pass },
  });
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM ?? "Ubasti Cat Cafe <hello@ubasti.in>";

  if (!transporter) {
    // Dev fallback — log the email so developers can see the OTP code
    console.log(`\n[EMAIL DEV] To: ${to}\nSubject: ${subject}\n${html}\n`);
    return;
  }

  await transporter.sendMail({ from, to, subject, html });
}
