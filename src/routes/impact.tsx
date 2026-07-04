import { createFileRoute } from "@tanstack/react-router";
import { ImpactPage } from "@/pages";

export const Route = createFileRoute("/impact")({
  component: ImpactPage,
});
