import { createFileRoute } from "@tanstack/react-router";
import { CausesPage } from "@/pages";

export const Route = createFileRoute("/causes/")({
  component: CausesPage,
});
