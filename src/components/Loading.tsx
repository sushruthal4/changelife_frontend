import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
    );
};

export const LoadingCard: React.FC = () => {
    return (
        <div className='bg-white rounded-lg shadow p-6'>
            <div className='space-y-4'>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className='h-4 bg-gray-200 rounded animate-pulse'></div>
                ))}
            </div>
        </div>
    );
};

export const LoadingGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className='bg-white rounded-lg shadow overflow-hidden'>
                    <div className='h-48 bg-gray-200 animate-pulse'></div>
                    <div className='p-4 space-y-3'>
                        <div className='h-4 bg-gray-200 rounded animate-pulse'></div>
                        <div className='h-4 bg-gray-200 rounded animate-pulse w-5/6'></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
