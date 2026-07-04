import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
    error: Error | null;
    onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
    if (!error) return null;

    return (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3'>
            <AlertCircle className='h-5 w-5 text-red-600 flex-shrink-0 mt-0.5' />
            <div className='flex-1'>
                <h3 className='font-semibold text-red-900'>Error</h3>
                <p className='text-sm text-red-700 mt-1'>{error.message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className='mt-3 text-sm text-red-700 font-semibold hover:text-red-900 flex items-center gap-1'
                    >
                        <RefreshCw className='h-4 w-4' />
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

interface EmptyStateProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => {
    return (
        <div className='text-center py-12'>
            <div className='text-brand-primary mb-4'>
                <AlertCircle className='h-12 w-12 mx-auto opacity-40' />
            </div>
            <h3 className='text-lg font-semibold text-brand-dark'>{title}</h3>
            {description && <p className='text-brand-dark/60 text-sm mt-1'>{description}</p>}
            {action && (
                <button
                    onClick={action.onClick}
                    className='mt-4 bg-brand-primary text-white py-2 px-4 rounded-lg hover:bg-brand-warm text-sm font-semibold'
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};
