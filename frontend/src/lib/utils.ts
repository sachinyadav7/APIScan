import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely — avoids conflicts */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Format a date string for display */
export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/** Format duration in ms to human-readable */
export function formatDuration(ms: number | null): string {
    if (!ms) return '–';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}

/** Get severity color class */
export function severityColor(severity: string): string {
    const colors: Record<string, string> = {
        CRITICAL: 'text-red-500 bg-red-500/10 border-red-500/20',
        HIGH: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        MEDIUM: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        LOW: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        INFO: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    };
    return colors[severity] || colors.INFO;
}

/** Get scan status color class */
export function statusColor(status: string): string {
    const colors: Record<string, string> = {
        COMPLETED: 'text-emerald-400 bg-emerald-400/10',
        RUNNING: 'text-blue-400 bg-blue-400/10',
        PENDING: 'text-yellow-400 bg-yellow-400/10',
        FAILED: 'text-red-400 bg-red-400/10',
    };
    return colors[status] || '';
}
