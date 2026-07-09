import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { Message } from '../hooks/useCrawl';

interface ChatWindowProps {
    messages: Message[];
    onSendMessage: (msg: string) => void;
    isLoading: boolean;
    isIndexed: boolean;
}

export function ChatWindow({ messages, onSendMessage, isLoading, isIndexed }: ChatWindowProps) {
    const [input, setInput] = useState('');
    const listRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = () => {
        if (!input.trim() || isLoading || !isIndexed) return;
        onSendMessage(input.trim());
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <div
                ref={listRef}
                className="flex-1 overflow-y-auto px-6 py-6 space-y-6 flex flex-col"
            >
                {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-[#8e95a9] text-[15px] font-medium">Ask your first question...</p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <MessageBubble key={i} {...msg} />
                    ))
                )}
            </div>

            <div className="shrink-0 p-4 bg-white border-t border-slate-100/50">
                <div className="relative flex gap-3">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={messages.length === 0 ? "Ask your first question..." : "Ask a follow-up question..."}
                        className="flex-1 resize-none bg-white border border-slate-200 rounded-[14px] px-5 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-shadow text-[15px] shadow-sm disabled:opacity-50"
                        rows={1}
                        disabled={isLoading || !isIndexed}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading || !isIndexed}
                        className="h-[56px] px-8 rounded-[14px] font-semibold transition-all bg-[#8B5CF6] text-white hover:bg-[#7C3AED] disabled:bg-[#8B5CF6]/50 disabled:cursor-not-allowed shadow-sm shrink-0"
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    );
}
