import { Database, FileText, Blocks, Clock } from 'lucide-react';

interface Stats {
    pagesIndexed: number;
    chunksCreated: number;
    embeddingsGenerated: number;
    processingTime: string;
}

interface StatisticsCardProps {
    stats: Stats | null;
}

export function StatisticsCard({ stats }: StatisticsCardProps) {
    if (!stats) return null;

    const items = [
        { label: 'Pages Crawled', value: stats.pagesIndexed, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Chunks Created', value: stats.chunksCreated, icon: Blocks, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Embeddings', value: stats.embeddingsGenerated, icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Processing Time', value: stats.processingTime, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    return (
        <div className="w-full max-w-3xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
            {items.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center text-center">
                    <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.color} flex items-center justify-center mb-3`}>
                        <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 mb-1">{item.value}</span>
                    <span className="text-xs font-medium text-gray-500">{item.label}</span>
                </div>
            ))}
        </div>
    );
}
