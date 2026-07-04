import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminUsersPage } from "@/pages";

export const Route = createFileRoute("/admin/users")({
  component: () => (
    <ProtectedRoute>
      <AdminUsersPage />
    </ProtectedRoute>
  ),
});
