import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProgressCardProps {
    status: 'idle' | 'crawling' | 'success' | 'error';
    report?: {
        pagesIndexed: number;
        chunksCreated: number;
        embeddingsGenerated: number;
        processingTime: string;
    } | null;
}

export function ProgressCard({ status, report }: ProgressCardProps) {
    const [elapsed, setElapsed] = useState(0);

    /* Live elapsed timer while crawling */
    useEffect(() => {
        if (status !== 'crawling') { setElapsed(0); return; }
        const t = setInterval(() => setElapsed(s => s + 1), 1000);
        return () => clearInterval(t);
    }, [status]);

    if (status === 'idle') return null;

    if (status === 'crawling') {
        return (
            <div className="w-full rounded-2xl border border-violet-100 bg-violet-50 px-5 py-4 flex items-start gap-4 animate-fade-in">
                <Loader2 className="w-5 h-5 text-violet-500 mt-0.5 shrink-0 animate-spin" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-violet-800">Crawling & indexing…</p>
                    <p className="text-xs text-violet-500 mt-0.5">
                        Fetching pages, extracting content, generating embeddings · {elapsed}s elapsed
                    </p>
                    {/* Indeterminate progress bar */}
                    <div className="mt-3 h-1.5 w-full rounded-full bg-violet-100 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-violet-400"
                            style={{
                                width: '40%',
                                animation: 'progressIndeterminate 1.5s ease-in-out infinite',
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'success' && report) {
        return (
            <div className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 flex items-start gap-4 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-emerald-800">Ready — ask your first question below</p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                        {report.pagesIndexed} page{report.pagesIndexed !== 1 ? 's' : ''} · {report.chunksCreated} chunks · {report.embeddingsGenerated} embeddings · {report.processingTime}
                    </p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="w-full rounded-2xl border border-red-100 bg-red-50 px-5 py-4 flex items-center gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-sm text-red-600">Crawl failed. Check the URL and try again.</p>
            </div>
        );
    }

    return null;
}
