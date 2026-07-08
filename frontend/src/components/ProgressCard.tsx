import { Loader2, CheckCircle2 } from 'lucide-react';

interface ProgressCardProps {
    status: 'idle' | 'crawling' | 'success' | 'error';
}

export function ProgressCard({ status }: ProgressCardProps) {
    if (status === 'idle' || status === 'error') return null;

    if (status === 'crawling') {
        return (
            <div className="w-full max-w-2xl mx-auto animate-fade-in">
                <div className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-5 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                        <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Crawling & Indexing…</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Extracting content, generating embeddings, and building knowledge base</p>
                        {/* Progress bar animation */}
                        <div className="mt-3 h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse" style={{ width: '65%' }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // success
    return (
        <div className="w-full max-w-2xl mx-auto animate-fade-in">
            <div className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-green-100 dark:border-green-900/30 rounded-2xl p-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Knowledge Base Ready</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ask anything about the crawled website below</p>
                </div>
            </div>
        </div>
    );
}
