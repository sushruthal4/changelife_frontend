import React, { createContext, useContext, useCallback, useState } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType, duration = 3000) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const toast: Toast = { id, message, type, duration };

        setToasts((prev) => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    const getToastStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-900';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-900';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-900';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-900';
        }
    };

    const getIcon = (type: ToastType) => {
        const iconProps = { className: 'h-5 w-5' };
        switch (type) {
            case 'success':
                return <CheckCircle {...iconProps} className='h-5 w-5 text-green-600' />;
            case 'error':
                return <AlertCircle {...iconProps} className='h-5 w-5 text-red-600' />;
            case 'warning':
                return <AlertTriangle {...iconProps} className='h-5 w-5 text-yellow-600' />;
            case 'info':
                return <Info {...iconProps} className='h-5 w-5 text-blue-600' />;
        }
    };

    return (
        <div className='fixed bottom-4 right-4 z-50 space-y-2'>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`border rounded-lg p-4 flex items-start gap-3 shadow-lg ${getToastStyles(
                        toast.type
                    )}`}
                >
                    {getIcon(toast.type)}
                    <div className='flex-1'>
                        <p className='text-sm font-medium'>{toast.message}</p>
                    </div>
                    <button
                        onClick={() => onRemove(toast.id)}
                        className='flex-shrink-0 ml-2 hover:opacity-70'
                    >
                        <X className='h-4 w-4' />
                    </button>
                </div>
            ))}
        </div>
    );
};
