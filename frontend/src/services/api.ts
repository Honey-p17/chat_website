export interface IndexingReport {
    success: boolean;
    pagesIndexed: number;
    chunksCreated: number;
    embeddingsGenerated: number;
    failedChunks: number;
    processingTime: string;
    collectionName: string;
    errorDetails?: string;
}

export interface Citation {
    title?: string;
    url: string;
    snippet: string;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
    crawl: async (url: string): Promise<IndexingReport> => {
        const res = await fetch(`${API_BASE}/crawl`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || `Failed to crawl (status: ${res.status})`);
        }
        return res.json();
    }
};
