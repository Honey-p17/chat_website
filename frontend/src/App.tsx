import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatPage } from './pages/ChatPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { Message } from './components/ChatWindow';
import { api, IndexingReport } from './services/api';

function App() {
    const [isBackendConnected, setIsBackendConnected] = useState(false);
    
    // Crawler state
    const [isCrawling, setIsCrawling] = useState(false);
    const [crawlStatus, setCrawlStatus] = useState<'idle' | 'crawling' | 'success' | 'error'>('idle');
    const [stats, setStats] = useState<IndexingReport | null>(null);
    const [crawlError, setCrawlError] = useState('');

    // Chat state
    const [messages, setMessages] = useState<Message[]>([]);
    const [isChatting, setIsChatting] = useState(false);
    const [chatError, setChatError] = useState('');

    // Health check
    useEffect(() => {
        const check = async () => {
            const isHealthy = await api.checkHealth();
            setIsBackendConnected(isHealthy);
        };
        check();
        const interval = setInterval(check, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleCrawl = async (url: string) => {
        setIsCrawling(true);
        setCrawlStatus('crawling');
        setCrawlError('');
        setStats(null);
        setMessages([]); // Reset chat when crawling new site

        try {
            const report = await api.crawlWebsite(url);
            if (report.success) {
                setStats(report);
                setCrawlStatus('success');
            } else {
                throw new Error('Indexing failed on the server.');
            }
        } catch (error: any) {
            console.error('Crawl failed:', error);
            setCrawlStatus('error');
            const backendError = error.response?.data?.error;
            setCrawlError(backendError || 'Failed to crawl website. Please ensure it is accessible.');
        } finally {
            setIsCrawling(false);
        }
    };

    const handleSendMessage = async (content: string) => {
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content };
        const aiMsgId = (Date.now() + 1).toString();
        const initialAiMsg: Message = { id: aiMsgId, role: 'assistant', content: '', sources: undefined };
        
        setMessages(prev => [...prev, userMsg, initialAiMsg]);
        setIsChatting(true);
        setChatError('');

        try {
            await api.chatStream(
                content,
                (chunk) => {
                    setMessages(prev => prev.map(msg => 
                        msg.id === aiMsgId ? { ...msg, content: msg.content + chunk } : msg
                    ));
                },
                (sources) => {
                    setMessages(prev => prev.map(msg => 
                        msg.id === aiMsgId ? { ...msg, sources } : msg
                    ));
                },
                (err) => {
                    setChatError(err);
                }
            );
        } catch (error: any) {
            console.error('Chat failed:', error);
            setChatError(error.message || 'An error occurred while generating the response.');
        } finally {
            setIsChatting(false);
        }
    };

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans flex flex-col transition-colors selection:bg-blue-200 dark:selection:bg-blue-900">
                {/* Status indicator */}
                <div className="fixed bottom-4 right-4 z-50">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center transition-colors ${isBackendConnected ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${isBackendConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                        {isBackendConnected ? 'Backend Connected' : 'Backend Offline'}
                    </div>
                </div>

                <Navbar />
                
                <main className="flex-1 flex flex-col">
                    <Routes>
                        <Route 
                            path="/" 
                            element={
                                <ChatPage 
                                    isCrawling={isCrawling}
                                    crawlStatus={crawlStatus}
                                    crawlError={crawlError}
                                    messages={messages}
                                    isChatting={isChatting}
                                    chatError={chatError}
                                    onCrawl={handleCrawl}
                                    onSendMessage={handleSendMessage}
                                />
                            } 
                        />
                        <Route 
                            path="/analytics" 
                            element={<AnalyticsPage stats={stats} />} 
                        />
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
