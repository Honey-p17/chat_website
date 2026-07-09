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

    return (
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-10 flex flex-col gap-8">
            {/* Hero — hide once indexed */}
            {crawlStatus === 'idle' && (
                <HeroSection />
            )}

            {/* URL input (always visible until indexed) */}
            {!isIndexed && (
                <WebsiteInput
                    onCrawl={onCrawl}
                    isCrawling={isCrawling}
                    isIndexed={isIndexed}
                    onReset={onReset}
                />
            )}

            {/* Indexed compact bar */}
            {isIndexed && (
                <WebsiteInput
                    onCrawl={onCrawl}
                    isCrawling={false}
                    isIndexed={true}
                    onReset={onReset}
                />
            )}

            {/* Progress / status card */}
            {crawlStatus !== 'idle' && (
                <ProgressCard
                    status={crawlStatus}
                    report={report}
                />
            )}

            {/* Crawl error */}
            {crawlError && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 animate-fade-in">
                    {crawlError}
                </div>
            )}

            {/* Chat error */}
            {chatError && (
                <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-2.5 text-sm text-amber-700 animate-fade-in">
                    {chatError}
                </div>
            )}

            {/* Divider + chat interface */}
            <div className="flex-1 flex flex-col">
                {isIndexed && <div className="mb-4 h-px bg-gray-100" />}
                <ChatWindow
                    messages={messages}
                    onSendMessage={onSendMessage}
                    isLoading={isChatting}
                    isIndexed={isIndexed}
                />
            </div>
        </main>
    );
}
