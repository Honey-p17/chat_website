import React, { useState } from 'react';

interface WebsiteInputProps {
    onCrawl: (url: string) => void;
    isCrawling: boolean;
}

export function WebsiteInput({ onCrawl, isCrawling }: WebsiteInputProps) {
    const [url, setUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim() && !isCrawling) {
            onCrawl(url.trim());
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    disabled={isCrawling}
                    className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-shadow text-[15px] shadow-sm disabled:opacity-50"
                    required
                />
                <button
                    type="submit"
                    disabled={!url.trim() || isCrawling}
                    className="h-[50px] px-8 rounded-xl font-semibold transition-all bg-[#8B5CF6] text-white hover:bg-[#7C3AED] disabled:bg-[#8B5CF6]/50 disabled:cursor-not-allowed shadow-sm shrink-0"
                >
                    {isCrawling ? 'Crawling...' : 'Crawl'}
                </button>
            </form>
        </div>
    );
}
