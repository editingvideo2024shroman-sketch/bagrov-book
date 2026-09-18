import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/refund")({
  beforeLoad: () => {
    throw redirect({ to: "/offer", hash: "vozvrat" });
  },
});
