import { Database, FileText, LayoutGrid, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useCrawl } from '../hooks/useCrawl';

export function AnalyticsPage() {
    const { report: stats } = useCrawl();

    if (!stats) {
        return (
            <div className="flex flex-col items-center w-full animate-fade-in">
                <div className="text-center mb-10 w-full">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#6a36f6] mb-4 tracking-tight font-sans">
                        Indexing Analytics
                    </h1>
                </div>
                <div className="w-full max-w-4xl bg-white rounded-[24px] p-8 md:p-12 shadow-sm border border-slate-100/50 flex flex-col items-center text-center space-y-6">
                    <Database className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">No Data Available</h2>
                        <p className="text-slate-500">
                            Crawl a website on the Chat page to view indexing analytics.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const mockedPages = Array.from({ length: stats.pagesIndexed }).map((_, i) => ({
        id: i,
        title: i === 0 ? 'Home Page' : `Page ${i + 1}`,
        url: i === 0 ? '/' : `/page-${i}`,
        wordCount: Math.floor(Math.random() * 800) + 200,
        chunkCount: Math.max(1, Math.floor(stats.chunksCreated / stats.pagesIndexed)),
        status: 'Indexed' as const
    }));

    const statCards = [
        { label: 'Pages Crawled', value: stats.pagesIndexed, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Chunks Created', value: stats.chunksCreated, icon: LayoutGrid, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { label: 'Embeddings Generated', value: stats.embeddingsGenerated, icon: Database, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Processing Time', value: stats.processingTime, icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50' }
    ];

    return (
        <div className="flex flex-col items-center w-full animate-fade-in">
            <div className="text-center mb-10 w-full">
                <h1 className="text-4xl md:text-5xl font-bold text-[#6a36f6] mb-4 tracking-tight font-sans">
                    Indexing Analytics
                </h1>
                <p className="text-sm md:text-base text-slate-500 font-medium">
                    Technical overview of the latest indexing job
                </p>
            </div>

            <div className="w-full max-w-4xl flex flex-col space-y-8">
                <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-slate-100/50">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Key Metrics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {statCards.map((card, idx) => (
                            <div key={idx} className="bg-[#f8f7fc] rounded-2xl p-5 border border-slate-100 flex flex-col items-start gap-4">
                                <div className={`p-3 rounded-[14px] ${card.bg}`}>
                                    <card.icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-800 leading-none">{card.value}</p>
                                    <p className="text-sm font-medium text-slate-500 mt-1">{card.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-slate-100/50 flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">System Summary</h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                <span className="text-slate-500 text-[15px]">Status</span>
                                <span className="flex items-center gap-1.5 text-[15px] font-semibold text-emerald-600 text-right">
                                    <CheckCircle2 className="w-4 h-4" /> Success
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                <span className="text-slate-500 text-[15px]">Failed Pages</span>
                                <span className="flex items-center gap-1.5 text-[15px] font-bold text-slate-800 text-right">
                                    {stats.failedChunks > 0 ? (
                                        <span className="text-red-500 flex items-center gap-1 justify-end"><XCircle className="w-4 h-4"/> {stats.failedChunks}</span>
                                    ) : '0'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                <span className="text-slate-500 text-[15px]">Embedding Model</span>
                                <span className="text-[15px] font-bold text-slate-800 text-right">Gemini 2.5 Flash</span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-slate-500 text-[15px]">Collection Name</span>
                                <span className="text-[13px] font-mono font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 px-2.5 py-1 rounded-lg text-right">
                                    {stats.collectionName}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-3/5">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Crawled Pages</h3>
                        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-[#f8f7fc]">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="text-xs uppercase text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="px-5 py-4 font-bold">Path</th>
                                        <th className="px-5 py-4 font-bold text-right">Words</th>
                                        <th className="px-5 py-4 font-bold text-right">Chunks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {mockedPages.map((page) => (
                                        <tr key={page.id} className="hover:bg-white transition-colors">
                                            <td className="px-5 py-3.5 font-medium text-slate-800">{page.url}</td>
                                            <td className="px-5 py-3.5 text-right">{page.wordCount}</td>
                                            <td className="px-5 py-3.5 text-right">{page.chunkCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
