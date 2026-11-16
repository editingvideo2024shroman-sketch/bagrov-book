import nodemailer from "nodemailer";
import { bookAccessUrl } from "./robokassa.server";

type Smtp = {
  host: string;
  user: string;
  pass: string;
  port: number;
  from: string;
};

export function smtpConfig(): Smtp {
  const host = (process.env.SMTP_HOST || "").trim();
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASS || "").trim();
  const port = Number(process.env.SMTP_PORT || 465);
  const from = (process.env.MAIL_FROM || user).trim();
  return { host, user, pass, port: Number.isFinite(port) ? port : 465, from };
}

export function mailConfigured() {
  const cfg = smtpConfig();
  return Boolean(cfg.host && cfg.user && cfg.pass);
}

function transport(cfg: Smtp, port: number) {
  return nodemailer.createTransport({
    host: cfg.host,
    port,
    secure: port === 465,
    auth: { user: cfg.user, pass: cfg.pass },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
    tls: { servername: cfg.host },
  });
}

function portsToTry(preferred: number) {
  const list = preferred === 587 ? [587, 465] : [465, 587];
  return [...new Set(list)];
}

export function mailErrorText(err: unknown) {
  if (err instanceof Error) return err.message.slice(0, 300);
  return String(err).slice(0, 300);
}

export async function deliverMail(input: { to: string; subject: string; text: string }) {
  const cfg = smtpConfig();
  if (!cfg.host || !cfg.user || !cfg.pass) throw new Error("no_smtp");
  let last: unknown;
  for (const port of portsToTry(cfg.port)) {
    try {
      await transport(cfg, port).sendMail({
        from: `Тимофей Багров <${cfg.from}>`,
        to: input.to,
        bcc: input.to === "vikramodin@gmail.com" ? undefined : "vikramodin@gmail.com",
        subject: input.subject,
        text: input.text,
      });
      return port;
    } catch (err) {
      last = err;
    }
  }
  throw last instanceof Error ? last : new Error(mailErrorText(last));
}

const sentLetters = new Map<string, Promise<"sent" | "skip">>();

export async function sendBookLetter(input: { email: string; outSum: string; invId: string }) {
  const email = input.email.trim().toLowerCase();
  const key = `${input.invId}|${email}`;
  const already = sentLetters.get(key);
  if (already) return already;

  const job = deliverBookLetter({ ...input, email }).catch((err) => {
    sentLetters.delete(key);
    throw err;
  });
  sentLetters.set(key, job);
  return job;
}

async function deliverBookLetter(input: { email: string; outSum: string; invId: string }) {
  const email = input.email.trim().toLowerCase();
  if (!email.includes("@")) return "skip" as const;
  const handbook = bookAccessUrl(input.outSum, input.invId, email);
  if (!handbook) throw new Error("no_sign");

  const pp = "https://www.timofey-bagrov.ru/legkaya.html";
  const text = [
    "Оплата прошла. Ваши книги:",
    "",
    "1. Справочник «150 таёжных рецептов»",
    handbook,
    "",
    "2. Книга «50 рецептов ПП»",
    pp,
    "",
    "Если письма нет во входящих, откройте «Спам» и «Рассылки».",
  ].join("\n");

  await deliverMail({
    to: email,
    subject: "Ваши книги: справочник и «50 рецептов ПП»",
    text,
  });
  return "sent" as const;
}
