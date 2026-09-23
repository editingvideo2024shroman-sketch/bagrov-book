import { createFileRoute } from "@tanstack/react-router";
import { resultSignatureOk } from "@/lib/robokassa.server";

async function readParams(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  if (request.method === "POST") {
    const text = await request.text();
    const body = new URLSearchParams(text);
    for (const [key, value] of body) params.set(key, value);
  }
  return params;
}

async function answer(request: Request) {
  const params = await readParams(request);
  const invId = params.get("InvId") ?? "";
  if (!resultSignatureOk(params)) {
    return new Response("bad sign", { status: 400 });
  }
  return new Response(`OK${invId}`, {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/robokassa/result")({
  server: {
    handlers: {
      POST: ({ request }) => answer(request),
      GET: ({ request }) => answer(request),
    },
  },
});
