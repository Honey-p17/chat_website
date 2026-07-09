import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SourcesCard, Citation } from './SourcesCard';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    sources?: Citation[];
}

const REFUSAL_PHRASE = "I couldn't find this information on the crawled website.";

export function MessageBubble({ role, content, sources }: MessageBubbleProps) {
    const isUser = role === 'user';
    const isRefusal = !isUser && content.includes(REFUSAL_PHRASE);

    /* User message */
    if (isUser) {
        return (
            <div className="flex justify-end mb-3">
                <div className="max-w-[78%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-violet-600 text-white text-sm leading-relaxed break-words">
                    {content}
                </div>
            </div>
        );
    }

    /* Grounded refusal — muted, italic, no sources */
    if (isRefusal) {
        return (
            <div className="flex justify-start mb-3">
                <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-200 bg-gray-50 text-gray-400 text-sm italic leading-relaxed">
                    {content}
                </div>
            </div>
        );
    }

    /* Normal assistant answer with markdown + sources */
    return (
        <div className="flex justify-start mb-3">
            <div className="max-w-[80%] flex flex-col">
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-200 bg-white text-gray-800 text-sm leading-relaxed shadow-sm break-words">
                    {content ? (
                        <div className="prose prose-sm max-w-none
                            prose-p:my-1 prose-p:leading-relaxed
                            prose-headings:font-semibold prose-headings:my-2
                            prose-ul:my-1 prose-ol:my-1 prose-li:my-0
                            prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[12px] prose-code:text-violet-700
                            prose-code:before:content-none prose-code:after:content-none
                            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-4
                            prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-gray-900">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                        </div>
                    ) : (
                        /* Streaming cursor while tokens are arriving */
                        <span className="inline-block w-2 h-4 bg-gray-300 animate-pulse rounded-sm align-middle" />
                    )}
                </div>
                {sources && sources.length > 0 && (
                    <SourcesCard sources={sources} />
                )}
            </div>
        </div>
    );
}
