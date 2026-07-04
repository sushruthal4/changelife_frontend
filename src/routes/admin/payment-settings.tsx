import { createFileRoute } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminPaymentSettingsPage } from '@/pages';

export const Route = createFileRoute('/admin/payment-settings')({
    component: () => (
        <ProtectedRoute>
            <AdminPaymentSettingsPage />
        </ProtectedRoute>
    ),
});
