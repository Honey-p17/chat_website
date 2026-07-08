import { ExternalLink, FileText } from 'lucide-react';

export interface Citation {
    url: string;
    title: string;
    chunkText?: string;
}

interface SourcesCardProps {
    sources: Citation[];
}

export function SourcesCard({ sources }: SourcesCardProps) {
    if (!sources || sources.length === 0) return null;

    // Filter duplicates by URL
    const uniqueSources = sources.filter((source, index, self) =>
        index === self.findIndex((t) => t.url === source.url)
    );

    return (
        <div className="flex flex-col gap-2 mt-4">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Sources
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {uniqueSources.map((source, index) => (
                    <div 
                        key={index}
                        className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group flex flex-col justify-between"
                    >
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1" title={source.title || source.url}>
                                {source.title || new URL(source.url).hostname}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                {source.chunkText || source.url}
                            </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-[70%]">
                                {new URL(source.url).hostname}
                            </span>
                            <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 opacity-80 group-hover:opacity-100 transition-opacity"
                            >
                                Open <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
