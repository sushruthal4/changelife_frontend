import { createFileRoute } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminCausesPage } from '@/pages';

export const Route = createFileRoute('/admin/causes')({
    component: () => (
        <ProtectedRoute>
            <AdminCausesPage />
        </ProtectedRoute>
    ),
});
