import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { Citation } from './SourcesCard';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: Citation[];
}

interface ChatWindowProps {
    messages: Message[];
    onSendMessage: (msg: string) => void;
    isLoading: boolean;
    isIndexed: boolean;
}

export function ChatWindow({ messages, onSendMessage, isLoading, isIndexed }: ChatWindowProps) {
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + 'px';
        }
    }, [input]);

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    /* ── Empty/locked state ── */
    if (!isIndexed) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
                <p className="text-sm text-gray-400">Crawl a website above to start asking questions</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col" style={{ height: 'calc(100vh - 420px)', minHeight: '380px' }}>
            {/* Message list */}
            <div className="flex-1 overflow-y-auto px-1 py-4">
                {messages.length === 0 && (
                    <div className="text-center text-sm text-gray-400 py-8">
                        Ask anything about the crawled website…
                    </div>
                )}
                {messages.map(msg => (
                    <MessageBubble
                        key={msg.id}
                        role={msg.role}
                        content={msg.content}
                        sources={msg.sources}
                    />
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input bar — not fixed, just at the bottom of the flex container */}
            <div className="border-t border-gray-100 bg-white pt-3 pb-1">
                <div className="flex items-end gap-2 border border-gray-200 rounded-2xl px-3 py-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all bg-white">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        placeholder="Ask anything about this website…"
                        rows={1}
                        className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-50 max-h-[140px] leading-relaxed py-0.5"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors bg-violet-600 text-white hover:bg-violet-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                </div>
                <p className="text-center text-[11px] text-gray-300 mt-1.5">Enter to send · Shift+Enter for new line</p>
            </div>
        </div>
    );
}
