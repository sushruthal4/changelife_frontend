import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-2xl',
        full: 'h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] max-w-7xl',
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/65 p-2 backdrop-blur-sm'>
            <div className={`bg-white rounded-lg shadow-xl ${sizes[size]} max-h-[92vh] overflow-y-auto`}>
                <div className='sticky top-0 z-10 flex items-center justify-between border-b border-brand-dark/10 bg-white p-4 sm:p-6'>
                    <h2 className='text-xl font-bold text-brand-dark'>{title}</h2>
                    <button
                        onClick={onClose}
                        className='rounded px-2 text-2xl text-brand-dark/50 hover:bg-brand-muted hover:text-brand-dark'
                        aria-label='Close modal'
                    >
                        ×
                    </button>
                </div>
                <div className='p-4 sm:p-6'>{children}</div>
            </div>
        </div>
    );
};

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    loading,
}) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <div className='bg-white rounded-lg shadow-xl max-w-sm'>
                <div className='p-6'>
                    <h2 className='text-lg font-bold text-gray-900'>{title}</h2>
                    <p className='text-gray-600 mt-2'>{message}</p>
                    <div className='flex gap-3 mt-6'>
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className='flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50'
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
