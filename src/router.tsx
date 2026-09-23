import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

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
          result[key] = value;
          continue;
        }
        if (value === "true") result[key] = true;
        else if (value === "false") result[key] = false;
        else result[key] = value;
      }
      return result;
    },
  });
}
