import React, { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from './Loading';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.navigate({ to: '/admin/login' });
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};
