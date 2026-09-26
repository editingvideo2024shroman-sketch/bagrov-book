import { createHash } from "node:crypto";

const LOGIN = (process.env.ROBOKASSA_LOGIN ?? "").trim();
const PASSWORD1 = (process.env.ROBOKASSA_PASSWORD1 ?? "").trim();
const PASSWORD2 = (process.env.ROBOKASSA_PASSWORD2 ?? "").trim();

const OUT_SUM = "10.00";
const ITEM_NAME = "Электронный справочник 150 таёжных рецептов";

function md5(value: string) {
  return createHash("md5").update(value, "utf8").digest("hex");
}

function unquote(value: string) {
  const trimmed = value.trim();
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === "string" || typeof parsed === "number") return String(parsed);
    } catch {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

export function receiptJson() {
  return `{"items":[{"name":"${ITEM_NAME}","quantity":1,"sum":10.00,"payment_method":"full_payment","payment_object":"intellectual_activity","tax":"none"}]}`;
}

export function buildPayment(email: string) {
  if (!LOGIN || !PASSWORD1) throw new Error("robokassa_not_configured");
  const invId = String(Math.floor(Date.now() / 1000));
  const receipt = encodeURIComponent(receiptJson());
  const base = `${LOGIN}:${OUT_SUM}:${invId}:${receipt}:${PASSWORD1}:Shp_email=${email}`;
  return {
    action: "https://auth.robokassa.ru/Merchant/Index.aspx",
    fields: {
      MerchantLogin: LOGIN,
      OutSum: OUT_SUM,
      InvId: invId,
      Description: ITEM_NAME,
      Receipt: receipt,
      SignatureValue: md5(base),
      Email: email,
      Shp_email: email,
      Culture: "ru",
      Encoding: "utf-8",
    },
  };
}

function same(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function successSignatureOk(input: {
  outSum: string;
  invId: string;
  signature: string;
  email: string;
}) {
  if (!PASSWORD1) return false;
  const outSum = unquote(input.outSum);
  const invId = unquote(input.invId);
  const email = unquote(input.email);
  const signature = unquote(input.signature);
  const emailPart = email ? `:Shp_email=${email}` : "";
  const expected = md5(`${outSum}:${invId}:${PASSWORD1}${emailPart}`);
  return same(expected, signature);
}

export function resultSignatureOk(params: URLSearchParams) {
  if (!PASSWORD2) return false;
  const outSum = params.get("OutSum") ?? "";
  const invId = params.get("InvId") ?? "";
  const signature = params.get("SignatureValue") ?? "";
  const extra = [...params.keys()]
    .filter((key) => key.startsWith("Shp_"))
    .sort()
    .map((key) => `${key}=${params.get(key) ?? ""}`)
    .join(":");
  const tail = extra ? `:${extra}` : "";
  const expected = md5(`${outSum}:${invId}:${PASSWORD2}${tail}`);
  return Boolean(outSum && invId && same(expected, signature));
}
