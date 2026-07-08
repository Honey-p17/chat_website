import React, { useState } from 'react';
import { Globe, CheckCircle2, Loader2, Sparkles, MessageCircle } from 'lucide-react';

interface WebsiteInputProps {
    onCrawl: (url: string) => void;
    isCrawling: boolean;
    isIndexed?: boolean;
}

export function WebsiteInput({ onCrawl, isCrawling, isIndexed = false }: WebsiteInputProps) {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!url.trim()) {
            setError('Please enter a website URL');
            return;
        }
        try {
            new URL(url);
            onCrawl(url);
        } catch {
            setError('Please enter a valid URL (e.g., https://example.com)');
        }
    };

    /* ─── Success state: compact green pill ─── */
    if (isIndexed) {
        return (
            <div className="w-full max-w-2xl mx-auto animate-fade-in">
                <div className="flex items-center justify-between bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800/50 rounded-full px-5 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Website Indexed — Ready for questions</span>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors px-3 py-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                        New Site
                    </button>
                </div>
            </div>
        );
    }

    /* ─── Default state: URL input ─── */
    return (
        <div className="w-full max-w-2xl mx-auto relative animate-slide-up">
            {/* Floating decorations */}
            <div className="hidden md:block absolute -left-24 top-1/2 -translate-y-1/2 text-purple-300/60 dark:text-purple-700/40 -rotate-12">
                <div className="bg-white dark:bg-gray-800 p-3.5 rounded-2xl rounded-bl-sm shadow-lg border border-purple-100 dark:border-purple-900/40">
                    <MessageCircle className="w-7 h-7" />
                </div>
            </div>
            <div className="hidden md:block absolute -right-20 top-1/2 -translate-y-1/2 text-purple-300/60 dark:text-purple-700/40 rotate-12">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-br-sm shadow-lg border border-purple-100 dark:border-purple-900/40">
                    <Globe className="w-8 h-8" />
                </div>
            </div>

            {/* Outer glow container */}
            <div className="bg-gradient-to-b from-purple-100/40 to-transparent dark:from-purple-900/10 dark:to-transparent p-3 rounded-[28px]">
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800 shadow-lg shadow-purple-500/5 p-2 transition-all focus-within:shadow-xl focus-within:shadow-purple-500/10 focus-within:border-purple-300 dark:focus-within:border-purple-700"
                >
                    {/* Globe icon */}
                    <div className="pl-3 flex-shrink-0 text-gray-400 dark:text-gray-500">
                        <Globe className="w-5 h-5" />
                    </div>

                    {/* Input */}
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => { setUrl(e.target.value); setError(''); }}
                        placeholder="https://yourwebsite.com"
                        disabled={isCrawling}
                        className="flex-1 bg-transparent py-3 text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed min-w-0"
                    />

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isCrawling || !url.trim()}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-full shadow-md shadow-purple-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex-shrink-0"
                    >
                        {isCrawling ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="hidden sm:inline">Indexing…</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                <span>Start Chat</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Error text */}
            {error && (
                <p className="mt-3 text-sm text-red-500 text-center font-medium animate-fade-in">{error}</p>
            )}
        </div>
    );
}
