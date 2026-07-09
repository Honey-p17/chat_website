import { useState, useRef, useEffect, createContext, useContext, ReactNode } from 'react';
import { api, IndexingReport, Citation } from '../services/api';

export type CrawlStatus = 'idle' | 'crawling' | 'success' | 'error';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    sources?: Citation[];
}

function useCrawlInternal() {
    const [crawlStatus, setCrawlStatus] = useState<CrawlStatus>('idle');
    const [crawlError, setCrawlError] = useState('');
    const [report, setReport] = useState<IndexingReport | null>(null);
    const [simulatedStep, setSimulatedStep] = useState(0);

    const [messages, setMessages] = useState<Message[]>([]);
    const [isChatting, setIsChatting] = useState(false);
    const [chatError, setChatError] = useState('');
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (crawlStatus === 'crawling') {
            setSimulatedStep(1);
            timer = setInterval(() => {
                setSimulatedStep((prev) => {
                    if (prev === 1) return 2;
                    if (prev === 2) return 3;
                    return prev;
                });
            }, 3000);
        } else if (crawlStatus === 'success') {
            setSimulatedStep(4);
        } else {
            setSimulatedStep(0);
        }
        return () => clearInterval(timer);
    }, [crawlStatus]);

    const handleCrawl = async (url: string) => {
        setCrawlStatus('crawling');
        setCrawlError('');
        setReport(null);
        setMessages([]);
        setChatError('');

        try {
            const result = await api.crawl(url);
            setReport(result);
            setCrawlStatus('success');
        } catch (error: any) {
            setCrawlStatus('error');
            setCrawlError(error.message);
        }
    };

    const handleSendMessage = async (msg: string) => {
        if (!msg.trim()) return;
        
        setChatError('');
        const newMessages: Message[] = [...messages, { role: 'user', content: msg }];
        setMessages(newMessages);
        setIsChatting(true);

        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

        try {
            const res = await fetch(`${API_BASE}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: msg }),
                signal: controller.signal
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = res.body?.getReader();
            const decoder = new TextDecoder('utf-8');

            if (!reader) throw new Error('No reader available');

            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6);
                        if (dataStr === '[DONE]') {
                            break;
                        }

                        try {
                            const parsed = JSON.parse(dataStr);
                            if (parsed.error) {
                                const errMsg = typeof parsed.error === 'string' ? parsed.error : JSON.stringify(parsed.error);
                                setMessages((prev) => {
                                    const last = prev[prev.length - 1];
                                    return [...prev.slice(0, -1), { ...last, content: `**Error:** ${errMsg}` }];
                                });
                                break;
                            }

                            setMessages((prev) => {
                                const last = prev[prev.length - 1];
                                if (parsed.chunk) {
                                    return [...prev.slice(0, -1), { ...last, content: last.content + parsed.chunk }];
                                }
                                if (parsed.sources) {
                                    return [...prev.slice(0, -1), { ...last, sources: parsed.sources }];
                                }
                                return prev;
                            });
                        } catch (e) {
                            console.error('Error parsing SSE json', e);
                        }
                    }
                }
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                setChatError(error.message || 'Error communicating with chat API');
                setMessages((prev) => {
                    const last = prev[prev.length - 1];
                    if (last.role === 'assistant' && !last.content) {
                        return prev.slice(0, -1);
                    }
                    return prev;
                });
            }
        } finally {
            setIsChatting(false);
            abortControllerRef.current = null;
        }
    };

    const handleReset = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setCrawlStatus('idle');
        setCrawlError('');
        setReport(null);
        setMessages([]);
        setChatError('');
        setSimulatedStep(0);
    };

    return {
        isCrawling: crawlStatus === 'crawling',
        crawlStatus,
        crawlError,
        report,
        simulatedStep,
        messages,
        isChatting,
        chatError,
        handleCrawl,
        handleSendMessage,
        handleReset
    };
}

type CrawlContextType = ReturnType<typeof useCrawlInternal>;
const CrawlContext = createContext<CrawlContextType | null>(null);

export function CrawlProvider({ children }: { children: ReactNode }) {
    const crawlState = useCrawlInternal();
    return <CrawlContext.Provider value={crawlState}>{children}</CrawlContext.Provider>;
}

export function useCrawl() {
    const context = useContext(CrawlContext);
    if (!context) {
        throw new Error('useCrawl must be used within a CrawlProvider');
    }
    return context;
}
