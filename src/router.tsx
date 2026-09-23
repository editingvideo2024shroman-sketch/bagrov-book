import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

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

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    parseSearch: (searchStr) => {
      const raw = searchStr.startsWith("?") ? searchStr.slice(1) : searchStr;
      const query = new URLSearchParams(raw);
      const result: Record<string, unknown> = {};
      for (const [key, value] of query) {
        if (key === "OutSum" || key === "InvId" || key === "SignatureValue" || key === "Shp_email") {
          result[key] = unquote(value);
          continue;
        }
        if (value === "true") result[key] = true;
        else if (value === "false") result[key] = false;
        else result[key] = value;
      }
      return result;
    },
    stringifySearch: (search) => {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(search)) {
        if (value === undefined) continue;
        params.set(key, String(value));
      }
      const encoded = params.toString();
      return encoded ? `?${encoded}` : "";
    },
  });
}
