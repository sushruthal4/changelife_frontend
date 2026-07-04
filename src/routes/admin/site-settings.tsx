import { createFileRoute } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminSiteSettingsPage } from '@/pages';

export const Route = createFileRoute('/admin/site-settings')({
    component: () => (
        <ProtectedRoute>
            <AdminSiteSettingsPage />
        </ProtectedRoute>
    ),
});
