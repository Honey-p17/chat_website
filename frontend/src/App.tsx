import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatPage } from './pages/ChatPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { Message } from './components/ChatWindow';
import { api, IndexingReport } from './services/api';

function App() {
    const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);

    /* ── Crawl state ── */
    const [isCrawling, setIsCrawling]       = useState(false);
    const [crawlStatus, setCrawlStatus]     = useState<'idle' | 'crawling' | 'success' | 'error'>('idle');
    const [report, setReport]               = useState<IndexingReport | null>(null);
    const [crawlError, setCrawlError]       = useState('');

    /* ── Chat state ── */
    const [messages, setMessages]   = useState<Message[]>([]);
    const [isChatting, setIsChatting] = useState(false);
    const [chatError, setChatError]   = useState('');

    /* Backend health check — no dark mode, just connectivity */
    useEffect(() => {
        const check = async () => setIsBackendConnected(await api.checkHealth());
        check();
        const id = setInterval(check, 15_000);
        return () => clearInterval(id);
    }, []);

    const handleCrawl = async (url: string) => {
        setIsCrawling(true);
        setCrawlStatus('crawling');
        setCrawlError('');
        setReport(null);
        setMessages([]);
        setChatError('');
        try {
            const r = await api.crawlWebsite(url);
            if (r.success) {
                setReport(r);
                setCrawlStatus('success');
            } else {
                throw new Error('Indexing failed on the server.');
            }
        } catch (err: any) {
            setCrawlStatus('error');
            setCrawlError(
                err?.response?.data?.error ||
                err?.message ||
                'Failed to crawl. Please check the URL.'
            );
        } finally {
            setIsCrawling(false);
        }
    };

    const handleSendMessage = async (content: string) => {
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content };
        const aiId = (Date.now() + 1).toString();
        const aiMsg: Message = { id: aiId, role: 'assistant', content: '' };

        setMessages(prev => [...prev, userMsg, aiMsg]);
        setIsChatting(true);
        setChatError('');

        try {
            await api.chatStream(
                content,
                chunk => setMessages(prev =>
                    prev.map(m => m.id === aiId ? { ...m, content: m.content + chunk } : m)
                ),
                sources => setMessages(prev =>
                    prev.map(m => m.id === aiId ? { ...m, sources } : m)
                ),
                err => setChatError(err),
            );
        } catch (err: any) {
            setChatError(err?.message || 'An error occurred while generating the response.');
        } finally {
            setIsChatting(false);
        }
    };

    const handleReset = () => {
        setCrawlStatus('idle');
        setReport(null);
        setCrawlError('');
        setMessages([]);
        setChatError('');
    };

    return (
        <BrowserRouter>
            {/* Single fixed light theme — no dark mode, no class toggling */}
            <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">

                {/* Backend status — bottom-right corner, doesn't overlap anything */}
                {isBackendConnected !== null && (
                    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium shadow border ${
                        isBackendConnected
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-red-200 bg-red-50 text-red-600'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isBackendConnected ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                        {isBackendConnected ? 'API connected' : 'API offline'}
                    </div>
                )}

                <Navbar />

                <Routes>
                    <Route
                        path="/"
                        element={
                            <ChatPage
                                isCrawling={isCrawling}
                                crawlStatus={crawlStatus}
                                crawlError={crawlError}
                                report={report}
                                messages={messages}
                                isChatting={isChatting}
                                chatError={chatError}
                                onCrawl={handleCrawl}
                                onSendMessage={handleSendMessage}
                                onReset={handleReset}
                            />
                        }
                    />
                    <Route path="/analytics" element={<AnalyticsPage stats={report} />} />
                </Routes>

                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
