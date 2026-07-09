import { Sparkles, Globe, MessageCircle } from 'lucide-react';
import { WebsiteInput } from '../components/WebsiteInput';
import { ProgressChecklist } from '../components/ProgressChecklist';
import { ChatWindow } from '../components/ChatWindow';
import { useCrawl } from '../hooks/useCrawl';

export function ChatPage() {
    const {
        isCrawling,
        crawlStatus,
        simulatedStep,
        messages,
        isChatting,
        handleCrawl,
        handleSendMessage,
    } = useCrawl();

    const isIndexed = crawlStatus === 'success';

    return (
        <div className="flex flex-col items-center w-full animate-fade-in">
            {/* Header */}
            <div className="text-center mb-10 w-full">
                <h1 className="text-4xl md:text-5xl font-bold text-[#6a36f6] flex items-center justify-center gap-3 mb-4 tracking-tight font-sans">
                    Chat with Website <Sparkles className="w-10 h-10 text-[#8553f8]" fill="currentColor" />
                </h1>
                <p className="text-sm md:text-base text-slate-500 font-medium">
                    Crawl any website and get AI-powered answers from its content
                </p>
            </div>

            <div className="w-full flex flex-col space-y-8">
                {/* Crawl Card */}
                <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-slate-100/50">
                    <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-5 h-5 text-blue-400" />
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Crawl Website</h2>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">Enter a website URL and create a searchable knowledge base.</p>
                    
                    <WebsiteInput onCrawl={handleCrawl} isCrawling={isCrawling} />

                    {crawlStatus !== 'idle' && (
                        <div className="mt-6 w-full">
                            <ProgressChecklist simulatedStep={simulatedStep} />
                        </div>
                    )}
                </div>

                {/* Chat Card */}
                <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-slate-100/50 flex flex-col min-h-[500px]">
                    <div className="flex items-center gap-3 mb-2">
                        <MessageCircle className="w-5 h-5 text-slate-400" fill="currentColor" stroke="none" />
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Ask Questions</h2>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">Ask anything about the crawled website.</p>
                    
                    <div className="w-full flex-1 flex flex-col min-h-0 bg-[#fbfbfe] rounded-2xl border border-slate-100/50 overflow-hidden relative">
                        <ChatWindow
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isLoading={isChatting}
                            isIndexed={isIndexed}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
