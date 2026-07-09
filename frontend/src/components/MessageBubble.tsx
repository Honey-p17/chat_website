import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SourcesCard } from './SourcesCard';
import { Message } from '../hooks/useCrawl';

export function MessageBubble({ role, content, sources }: Message) {
    const isUser = role === 'user';

    if (isUser) {
        return (
            <div className="flex justify-end group">
                <div className="max-w-[80%] ml-auto flex flex-col items-end">
                    <div className="px-5 py-3.5 rounded-2xl rounded-br-sm bg-[#8B5CF6] text-white text-[15px] leading-relaxed break-words shadow-sm">
                        {content}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-start group">
            <div className="max-w-[85%] flex flex-col">
                <div className="px-5 py-4 rounded-2xl rounded-bl-sm bg-white border border-slate-100 shadow-sm flex flex-col gap-3 min-w-0">
                    <div className="text-slate-700 text-[15px] leading-relaxed break-words">
                        {content ? (
                            <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-100 prose-pre:text-slate-700 text-slate-700">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="flex space-x-1.5 items-center h-6">
                                <div className="w-1.5 h-1.5 bg-[#8B5CF6]/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-[#8B5CF6]/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-[#8B5CF6]/50 rounded-full animate-bounce"></div>
                            </div>
                        )}
                    </div>
                    {sources && sources.length > 0 && (
                        <div className="mt-1 pt-3 border-t border-slate-100/60">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sources</p>
                            <SourcesCard sources={sources} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
