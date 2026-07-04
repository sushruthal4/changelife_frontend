import { createFileRoute } from '@tanstack/react-router';
import { AdminLoginPage } from '@/pages';

export const Route = createFileRoute('/admin/login')({
    component: AdminLoginPage,
});
