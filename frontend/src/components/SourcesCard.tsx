import { ExternalLink } from 'lucide-react';

/* Matches the backend ResponseFormatter.Citation shape exactly */
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
        <div className="mt-3 flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sources</p>
            <div className="flex flex-wrap gap-2">
                {sources.map((src, i) => {
                    let hostname = src.url;
                    try { hostname = new URL(src.url).hostname.replace('www.', ''); } catch { /* keep raw */ }
                    return (
                        <a
                            key={i}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={src.snippet}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-white text-xs text-gray-600 font-medium hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-colors"
                        >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            {src.title || hostname}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
