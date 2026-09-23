import { createHash } from "node:crypto";

const LOGIN = process.env.ROBOKASSA_LOGIN ?? "";
const PASSWORD1 = process.env.ROBOKASSA_PASSWORD1 ?? "";
const PASSWORD2 = process.env.ROBOKASSA_PASSWORD2 ?? "";

const OUT_SUM = "890.00";
const ITEM_NAME = "Электронная книга 150 таёжных рецептов";

function md5(value: string) {
  return createHash("md5").update(value, "utf8").digest("hex");
}

function same(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function receiptJson() {
  return `{"items":[{"name":"${ITEM_NAME}","quantity":1,"sum":890.00,"payment_method":"full_payment","payment_object":"intellectual_activity","tax":"none"}]}`;
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
      Receipt: receiptJson(),
      SignatureValue: md5(base),
      Email: email,
      Shp_email: email,
      Culture: "ru",
      Encoding: "utf-8",
    },
  };
}

export function successSignatureOk(input: {
  outSum: string;
  invId: string;
  signature: string;
  email: string;
}) {
  if (!PASSWORD1) return false;
  const emailPart = input.email ? `:Shp_email=${input.email}` : "";
  const expected = md5(`${input.outSum}:${input.invId}:${PASSWORD1}${emailPart}`);
  return same(expected, input.signature);
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
