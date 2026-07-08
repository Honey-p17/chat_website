import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps {
    message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
    if (!message) return null;
    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center text-red-700 shadow-sm transition-all">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}
