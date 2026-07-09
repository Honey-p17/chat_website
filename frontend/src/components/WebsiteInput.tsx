import React, { useState } from 'react';
import { Globe, Loader2, CheckCircle2, RotateCcw } from 'lucide-react';

interface WebsiteInputProps {
    onCrawl: (url: string) => void;
    isCrawling: boolean;
    isIndexed: boolean;
    onReset: () => void;
}

export function WebsiteInput({ onCrawl, isCrawling, isIndexed, onReset }: WebsiteInputProps) {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!url.trim()) { setError('Please enter a URL'); return; }
        try {
            new URL(url);
            onCrawl(url.trim());
        } catch {
            setError('Enter a valid URL — e.g. https://example.com');
        }
    };

    /* After successful indexing, show a compact success bar with reset option */
    if (isIndexed) {
        return (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 animate-fade-in">
                <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm font-medium text-emerald-700 truncate">{url || 'Website indexed'}</span>
                </div>
                <button
                    onClick={onReset}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-800 transition-colors"
                >
                    <RotateCcw className="w-3.5 h-3.5" /> New site
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className={`flex items-center gap-0 rounded-2xl border bg-white shadow-sm overflow-hidden transition-all focus-within:ring-2 focus-within:ring-violet-200 focus-within:border-violet-400 ${error ? 'border-red-300' : 'border-gray-200'}`}>
                {/* Globe icon */}
                <div className="pl-4 pr-2 flex items-center shrink-0 text-gray-400">
                    <Globe className="w-4 h-4" />
                </div>

                {/* URL Input */}
                <input
                    type="url"
                    value={url}
                    onChange={e => { setUrl(e.target.value); setError(''); }}
                    placeholder="https://example.com"
                    disabled={isCrawling}
                    className="flex-1 h-12 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-60 pr-2"
                />

                {/* CTA Button */}
                <button
                    type="submit"
                    disabled={isCrawling || !url.trim()}
                    className="shrink-0 h-12 px-5 bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    {isCrawling
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Crawling…</>
                        : 'Crawl Website'
                    }
                </button>
            </div>
            {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
        </form>
    );
}
