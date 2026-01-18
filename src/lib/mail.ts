import nodemailer from "nodemailer";

export async function sendOrderEmail(opts: {
  to: string;
  subject: string;
  text: string;
}) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("SMTP not configured. Skipping email send.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || user,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
  });
}
