import { Citation } from '../services/api';

export function SourcesCard({ sources }: { sources: Citation[] }) {
    if (!sources || sources.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mt-3">
            {sources.map((src, i) => {
                let label = src.title;
                if (!label) {
                    try { label = new URL(src.url).hostname.replace('www.', ''); } catch { label = src.url; }
                }
                if (label.length > 70) label = label.slice(0, 68) + '…';

                return (
                    <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={src.snippet}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#8B5CF6]/10 text-xs font-medium text-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition-colors border border-[#8B5CF6]/20"
                    >
                        {label}
                    </a>
                );
            })}
        </div>
    );
}
