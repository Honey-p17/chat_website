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

    // Auto-scroll on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
        }
    }, [input]);

    const handleSend = () => {
        if (input.trim() && !isLoading && isIndexed) {
            onSendMessage(input.trim());
            setInput('');
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col">
            {/* Messages area */}
            <div className="flex-1 space-y-1 mb-6">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} role={msg.role} content={msg.content} sources={msg.sources} />
                ))}

                {isLoading && (
                    <div className="flex items-center gap-1.5 px-4 py-3">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input bar — NOT fixed; just at the bottom of the flow */}
            <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 via-gray-50/95 to-gray-50/0 dark:from-gray-950 dark:via-gray-950/95 dark:to-gray-950/0 pt-4 pb-2">
                <div className="flex items-end gap-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-1.5 transition-all focus-within:border-purple-300 dark:focus-within:border-purple-700 focus-within:shadow-xl focus-within:shadow-purple-500/5">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={!isIndexed || isLoading}
                        placeholder={isIndexed ? "Ask anything about this website…" : "Index a website first…"}
                        className="flex-1 bg-transparent resize-none py-3 pl-4 pr-2 text-sm sm:text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none disabled:opacity-50 max-h-[160px] min-h-[44px]"
                        rows={1}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading || !isIndexed}
                        className={`mb-1 mr-1 p-2.5 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                            input.trim() && !isLoading && isIndexed
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20 hover:shadow-purple-500/40'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        }`}
                    >
                        <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                </div>
                <p className="text-center text-[11px] text-gray-400 dark:text-gray-600 mt-2">
                    Press Enter to send · Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}
