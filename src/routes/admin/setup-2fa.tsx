import { createFileRoute } from "@tanstack/react-router";
import { AdminSetup2FAPage } from "@/pages";

export const Route = createFileRoute("/admin/setup-2fa")({
  component: AdminSetup2FAPage,
});
