import { ExternalLink } from 'lucide-react';

/* Matches backend ResponseFormatter.Citation exactly */
export interface Citation {
    title: string;
    url: string;
    snippet: string;
}

interface SourcesCardProps {
    sources: Citation[];
}

export function SourcesCard({ sources }: SourcesCardProps) {
    if (!sources || sources.length === 0) return null;

    return (
        <div className="mt-2.5 flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sources</p>
            <div className="flex flex-wrap gap-2">
                {sources.map((src, i) => {
                    let label = src.title;
                    if (!label) {
                        try { label = new URL(src.url).hostname.replace('www.', ''); } catch { label = src.url; }
                    }
                    // Trim long titles
                    if (label.length > 40) label = label.slice(0, 38) + '…';

                    return (
                        <a
                            key={i}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={src.snippet}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-white text-xs text-gray-600 font-medium whitespace-nowrap hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-colors"
                        >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            {label}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
