import { LayoutGrid } from 'lucide-react';

interface EmptyStateProps {
    message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
    return (
        <div className="w-full h-48 flex flex-col items-center justify-center text-center px-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <LayoutGrid className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">{message}</p>
        </div>
    );
}
