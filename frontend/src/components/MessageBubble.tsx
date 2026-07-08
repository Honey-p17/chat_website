import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SourcesCard, Citation } from './SourcesCard';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    sources?: Citation[];
}

export function MessageBubble({ role, content, sources }: MessageBubbleProps) {
    const isUser = role === 'user';

    return (
        <div className={`flex gap-3 py-4 animate-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}>
            {/* Avatar — only for assistant */}
            {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm shadow-purple-500/20">
                    <Bot className="w-4 h-4 text-white" />
                </div>
            )}

            <div className={`flex flex-col max-w-[85%] min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Bubble */}
                <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${
                    isUser
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-md shadow-sm shadow-purple-500/20'
                        : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md shadow-sm'
                }`}>
                    {isUser ? (
                        <div className="whitespace-pre-wrap break-words">{content}</div>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none break-words
                            prose-p:my-1.5 prose-p:leading-relaxed
                            prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
                            prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px] prose-code:before:content-none prose-code:after:content-none
                            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-xl prose-pre:overflow-x-auto
                            prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:my-3
                            prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0
                            prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold"
                        >
                            {content ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                            ) : (
                                <span className="inline-block w-2 h-4 bg-purple-500 animate-pulse rounded-sm" />
                            )}
                        </div>
                    )}
                </div>

                {/* Sources */}
                {!isUser && sources && sources.length > 0 && (
                    <div className="mt-2 w-full">
                        <SourcesCard sources={sources} />
                    </div>
                )}
            </div>

            {/* Avatar — only for user */}
            {isUser && (
                <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
            )}
        </div>
    );
}
