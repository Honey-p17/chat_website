import { Message } from '../components/ChatWindow';
import { WebsiteInput } from '../components/WebsiteInput';
import { ProgressCard } from '../components/ProgressCard';
import { ChatWindow } from '../components/ChatWindow';
import { ErrorBanner } from '../components/ErrorBanner';
import { HeroSection } from '../components/HeroSection';
import { SuggestedQuestions } from '../components/SuggestedQuestions';

interface ChatPageProps {
    isCrawling: boolean;
    crawlStatus: 'idle' | 'crawling' | 'success' | 'error';
    crawlError: string;
    messages: Message[];
    isChatting: boolean;
    chatError: string;
    onCrawl: (url: string) => Promise<void>;
    onSendMessage: (msg: string) => Promise<void>;
}

export function ChatPage({
    isCrawling,
    crawlStatus,
    crawlError,
    messages,
    isChatting,
    chatError,
    onCrawl,
    onSendMessage
}: ChatPageProps) {
    const isIndexed = crawlStatus === 'success';

    return (
        <div className="flex-1 flex flex-col items-center w-full max-w-5xl mx-auto px-4 py-8">
            
            {/* Show Hero only when completely idle */}
            {crawlStatus === 'idle' && !isCrawling && (
                <div className="mt-12 w-full flex flex-col items-center animate-fade-in-up">
                    <HeroSection />
                </div>
            )}

            {/* URL Input Box */}
            <div className={`w-full transition-all duration-500 ease-in-out ${crawlStatus === 'idle' ? 'mt-8 max-w-2xl' : 'mt-2 max-w-5xl'}`}>
                <WebsiteInput onCrawl={onCrawl} isCrawling={isCrawling} isIndexed={isIndexed} />
            </div>

            {/* Error banners */}
            {crawlError && (
                <div className="w-full mt-4">
                    <ErrorBanner message={crawlError} />
                </div>
            )}

            {chatError && (
                <div className="w-full mt-4">
                    <ErrorBanner message={chatError} />
                </div>
            )}

            {/* Progress Card (during crawling) */}
            <div className="w-full mt-4">
                <ProgressCard status={crawlStatus} />
            </div>

            {/* Suggested Questions (only right after indexing, when no messages exist) */}
            {isIndexed && messages.length === 0 && (
                <div className="w-full mt-8">
                    <SuggestedQuestions onSelect={onSendMessage} />
                </div>
            )}

            {/* Chat Window */}
            {isIndexed && (
                <div className={`w-full flex-1 transition-all duration-500 ${messages.length > 0 ? 'mt-4 opacity-100' : 'mt-0 opacity-0 h-0 overflow-hidden'}`}>
                    <ChatWindow 
                        messages={messages}
                        onSendMessage={onSendMessage}
                        isLoading={isChatting}
                        isIndexed={isIndexed}
                    />
                </div>
            )}
        </div>
    );
}
