import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend }) => {
    return (
        <div className='rounded-lg border border-brand-dark/10 bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='text-sm text-brand-dark/60'>{label}</p>
                    <p className='text-2xl font-bold text-brand-dark mt-2'>{value}</p>
                    {trend !== undefined && (
                        <p className={`text-sm mt-2 flex items-center gap-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend >= 0 ? <TrendingUp className='h-4 w-4' /> : <TrendingDown className='h-4 w-4' />}
                            {Math.abs(trend)}%
                        </p>
                    )}
                </div>
                {icon && <div className='text-brand-primary'>{icon}</div>}
            </div>
        </div>
    );
};

interface ProgressBarProps {
    current: number;
    target: number;
    label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, target, label }) => {
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

    return (
        <div>
            {label && <p className='text-sm font-semibold text-brand-dark/70 mb-2'>{label}</p>}
            <div className='h-2 w-full overflow-hidden rounded-full bg-brand-muted'>
                <div
                    className='h-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-warm transition-all duration-300'
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className='flex justify-between mt-2 text-xs font-semibold text-brand-dark/55'>
                <span>₹{Number(current || 0).toLocaleString("en-IN")}</span>
                <span>₹{Number(target || 0).toLocaleString("en-IN")}</span>
            </div>
        </div>
    );
};

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', size = 'md' }) => {
    const variants = {
        primary: 'bg-brand-muted text-brand-primary',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        secondary: 'bg-gray-100 text-gray-800',
    };

    const sizes = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base',
    };

    return (
        <span className={`inline-flex items-center rounded-full font-semibold ${variants[variant]} ${sizes[size]}`}>
            {children}
        </span>
    );
};

interface TagProps {
    label: string;
    onRemove?: () => void;
}

export const Tag: React.FC<TagProps> = ({ label, onRemove }) => {
    return (
        <div className='inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm'>
            <span>{label}</span>
            {onRemove && (
                <button
                    onClick={onRemove}
                    className='text-gray-500 hover:text-gray-700 font-semibold'
                >
                    ×
                </button>
            )}
        </div>
    );
};
