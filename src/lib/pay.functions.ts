import { createServerFn } from "@tanstack/react-start";
import { buildPayment, successSignatureOk } from "./robokassa.server";

export const startPayment = createServerFn({ method: "POST" })
  .validator((data: { email: string }) => {
    const email = data.email.trim().toLowerCase();
    if (!email.includes("@") || email.length > 120) throw new Error("bad_email");
    return { email };
  })
  .handler(async ({ data }) => buildPayment(data.email));

export const confirmPayment = createServerFn({ method: "POST" })
  .validator((data: { outSum: string; invId: string; signature: string; email: string }) => data)
  .handler(async ({ data }) =>
    successSignatureOk({
      outSum: data.outSum,
      invId: data.invId,
      signature: data.signature,
      email: data.email,
    }),
  );
