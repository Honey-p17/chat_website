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

    useEffect(() => {
        if (status !== 'crawling') { setElapsed(0); return; }
        const t = setInterval(() => setElapsed(s => s + 1), 1000);
        return () => clearInterval(t);
    }, [status]);

    if (status === 'idle') return null;

    if (status === 'crawling') {
        return (
            <div className="w-full rounded-xl border border-violet-100 bg-violet-50 px-4 py-3.5 flex items-start gap-3 animate-fade-in">
                <Loader2 className="w-4 h-4 text-violet-500 mt-0.5 shrink-0 animate-spin" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-violet-800">
                        Crawling &amp; indexing — {elapsed}s elapsed
                    </p>
                    <p className="text-xs text-violet-500 mt-0.5">
                        Fetching pages, extracting content, generating embeddings…
                    </p>
                    <div className="mt-2.5 h-1 w-full rounded-full bg-violet-100 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-violet-400"
                            style={{ animation: 'progressIndeterminate 1.6s ease-in-out infinite' }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'success' && report) {
        return (
            <div className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-emerald-800">
                        Ready — ask your first question below
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                        {report.pagesIndexed} page{report.pagesIndexed !== 1 ? 's' : ''} · {report.chunksCreated} chunks · {report.embeddingsGenerated} embeddings · {report.processingTime}
                    </p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 flex items-center gap-3 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-700">Crawl failed — check the URL and try again.</p>
            </div>
        );
    }

    return null;
}
