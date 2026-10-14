import nodemailer from "nodemailer";
import { bookAccessUrl } from "./robokassa.server";

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendBookLetter(input: { email: string; outSum: string; invId: string }) {
  const email = input.email.trim().toLowerCase();
  if (!email.includes("@")) return "skip" as const;
  if (!mailConfigured()) return "no_smtp" as const;
  const link = bookAccessUrl(input.outSum, input.invId, email);
  if (!link) return "no_sign" as const;

  const port = Number(process.env.SMTP_PORT || 465);
  const from = (process.env.MAIL_FROM || process.env.SMTP_USER || "").trim();
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const text = [
    "Оплата прошла.",
    "",
    "Откройте справочник по ссылке:",
    link,
    "",
    "На странице нажмите «Скачать справочник». Файл сохранится в телефоне и откроется без интернета.",
    "Если письма нет во входящих, загляните в «Спам».",
  ].join("\n");

  await transporter.sendMail({
    from: `Тимофей Багров <${from}>`,
    to: email,
    subject: "Ваш справочник «150 таёжных рецептов»",
    text,
  });
  return "sent" as const;
}
