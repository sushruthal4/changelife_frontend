import { createFileRoute } from "@tanstack/react-router";
import { CauseDetailPage } from "@/pages";

export const Route = createFileRoute("/causes/$id")({
  component: CauseDetailPage,
});
