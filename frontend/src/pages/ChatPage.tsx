import { HeroSection } from '../components/HeroSection';
import { WebsiteInput } from '../components/WebsiteInput';
import { ProgressCard } from '../components/ProgressCard';
import { ChatWindow, Message } from '../components/ChatWindow';
import { IndexingReport } from '../services/api';

interface ChatPageProps {
    isCrawling: boolean;
    crawlStatus: 'idle' | 'crawling' | 'success' | 'error';
    crawlError: string;
    report: IndexingReport | null;
    messages: Message[];
    isChatting: boolean;
    chatError: string;
    onCrawl: (url: string) => Promise<void>;
    onSendMessage: (msg: string) => Promise<void>;
    onReset: () => void;
}

export function ChatPage({
    isCrawling,
    crawlStatus,
    crawlError,
    report,
    messages,
    isChatting,
    chatError,
    onCrawl,
    onSendMessage,
    onReset,
}: ChatPageProps) {
    const isIndexed = crawlStatus === 'success';
    const isError   = crawlStatus === 'error';

    return (
        /*
         * Full-width page. A single centered column (max-w-4xl) holds everything.
         * No fixed-width box, no leftover pixel values — fills the viewport.
         */
        <div className="w-full min-h-[calc(100vh-56px)] bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6">

                {/* ── Hero ── only when completely idle */}
                {crawlStatus === 'idle' && (
                    <HeroSection />
                )}

                {/* ── URL input ── always visible until success */}
                {!isIndexed && (
                    <WebsiteInput
                        onCrawl={onCrawl}
                        isCrawling={isCrawling}
                        isIndexed={false}
                        onReset={onReset}
                    />
                )}

                {/* ── Compact "indexed" URL bar after success ── */}
                {isIndexed && (
                    <WebsiteInput
                        onCrawl={onCrawl}
                        isCrawling={false}
                        isIndexed={true}
                        onReset={onReset}
                    />
                )}

                {/* ── Progress / status banner ── */}
                {crawlStatus !== 'idle' && (
                    <ProgressCard status={crawlStatus} report={report} />
                )}

                {/* ── Crawl error with retry hint ── */}
                {isError && crawlError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 flex flex-col gap-1 animate-fade-in">
                        <p className="text-sm font-semibold text-red-700">Crawl failed</p>
                        <p className="text-sm text-red-600">{crawlError}</p>
                        <p className="text-xs text-red-400 mt-1">
                            Check the URL above and click "Crawl Website" to try again.
                        </p>
                    </div>
                )}

                {/* ── Chat error (during Q&A) ── */}
                {chatError && isIndexed && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 animate-fade-in">
                        <p className="text-sm text-amber-700">{chatError}</p>
                    </div>
                )}

                {/*
                 * ── Chat panel ──
                 * ONLY rendered after a successful crawl.
                 * Before crawl completes: nothing here at all.
                 * On error: nothing here (error banner above is enough).
                 */}
                {isIndexed && (
                    <div className="animate-fade-in-up">
                        <ChatWindow
                            messages={messages}
                            onSendMessage={onSendMessage}
                            isLoading={isChatting}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
