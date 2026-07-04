import { createFileRoute } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminDashboard } from '@/pages';

export const Route = createFileRoute('/admin/dashboard')({
    component: () => (
        <ProtectedRoute>
            <AdminDashboard />
        </ProtectedRoute>
    ),
});
