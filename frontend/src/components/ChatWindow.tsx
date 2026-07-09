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
}

export function ChatWindow({ messages, onSendMessage, isLoading }: ChatWindowProps) {
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Auto-resize textarea up to 140px
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height =
                Math.min(textareaRef.current.scrollHeight, 140) + 'px';
        }
    }, [input]);

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;
        onSendMessage(trimmed);
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        /*
         * Outer: flex column taking remaining page height.
         * We use a flex layout where the message list grows and the input
         * stays fixed at the bottom — no position:fixed, so nothing overlaps
         * the footer or status banners.
         */
        <div className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm" style={{ height: '520px' }}>
            {/* ── Scrollable message list ── */}
            <div
                ref={listRef}
                className="flex-1 overflow-y-auto px-4 py-5 space-y-1"
            >
                {messages.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-sm text-gray-400">
                            Ask anything about the crawled website…
                        </p>
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

                {/* Streaming typing indicator */}
                {isLoading && messages[messages.length - 1]?.content === '' && (
                    <div className="flex gap-1 px-1 py-2">
                        <span className="w-2 h-2 rounded-full bg-gray-300 dot-bounce" />
                        <span className="w-2 h-2 rounded-full bg-gray-300 dot-bounce-2" />
                        <span className="w-2 h-2 rounded-full bg-gray-300 dot-bounce-3" />
                    </div>
                )}

                {/* Scroll anchor */}
                <div ref={bottomRef} />
            </div>

            {/* ── Input bar — pinned to bottom of the panel ── */}
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-end gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
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
                        className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors bg-violet-600 text-white hover:bg-violet-700 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                        <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                </div>
                <p className="text-[11px] text-gray-300 mt-1.5 text-center">
                    Enter to send · Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}
