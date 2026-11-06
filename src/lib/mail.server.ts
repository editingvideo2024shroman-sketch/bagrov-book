import nodemailer from "nodemailer";
import { bookAccessUrl } from "./robokassa.server";

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendBookLetter(input: { email: string; outSum: string; invId: string }) {
  const email = input.email.trim().toLowerCase();
  if (!email.includes("@")) return "skip" as const;
  if (!mailConfigured()) throw new Error("no_smtp");
  const link = bookAccessUrl(input.outSum, input.invId, email);
  if (!link) throw new Error("no_sign");

  const port = Number(process.env.SMTP_PORT || 465);
  const from = (process.env.SMTP_USER || "").trim();
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
    "Оплата прошла. Это письмо со ссылками на обе книги, не чек.",
    "",
    "1. Справочник «150 таёжных рецептов»:",
    link,
    "",
    "На странице нажмите «Скачать справочник». Файл сохранится в телефоне и откроется без интернета.",
    "",
    "2. Книга «Лёгкая» — 50 рецептов на завтрак, обед и ужин:",
    "https://www.timofey-bagrov.ru/legkaya.html",
    "",
    "Откройте ссылку и сохраните страницу. Она тоже открывается без интернета.",
    "Если этого письма нет во входящих, откройте «Спам» и «Рассылки».",
  ].join("\n");

  await transporter.sendMail({
    from: `Тимофей Багров <${from}>`,
    to: email,
    bcc: email === "vikramodin@gmail.com" ? undefined : "vikramodin@gmail.com",
    subject: "Ваши книги: справочник и «Лёгкая»",
    text,
  });
  return "sent" as const;
}
