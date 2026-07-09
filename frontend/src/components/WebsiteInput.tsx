import React, { useState } from 'react';
import { Globe, Loader2, RotateCcw } from 'lucide-react';

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

    /* Compact "indexed" bar with reset option */
    if (isIndexed) {
        return (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 animate-fade-in">
                <div className="flex items-center gap-2 min-w-0">
                    <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-600 truncate">{url || 'Website indexed'}</span>
                </div>
                <button
                    onClick={() => { setUrl(''); setError(''); onReset(); }}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
                >
                    <RotateCcw className="w-3 h-3" /> New site
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {/* Input row */}
            <form
                onSubmit={handleSubmit}
                className={`flex items-center rounded-xl border bg-white overflow-hidden shadow-sm transition-all focus-within:ring-2 focus-within:ring-violet-200 focus-within:border-violet-400 ${error ? 'border-red-300' : 'border-gray-200'}`}
            >
                <div className="pl-3.5 flex items-center shrink-0 text-gray-400">
                    <Globe className="w-4 h-4" />
                </div>

                <input
                    type="url"
                    value={url}
                    onChange={e => { setUrl(e.target.value); setError(''); }}
                    placeholder="https://example.com"
                    disabled={isCrawling}
                    className="flex-1 h-12 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-60 px-3"
                />

                <button
                    type="submit"
                    disabled={isCrawling || !url.trim()}
                    className="shrink-0 h-12 px-5 bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    {isCrawling
                        ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Crawling…</span></>
                        : 'Crawl Website'
                    }
                </button>
            </form>

            {error && (
                <p className="text-xs text-red-500 pl-1 animate-fade-in">{error}</p>
            )}
        </div>
    );
}
