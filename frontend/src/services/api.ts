/// <reference types="vite/client" />
import axios from 'axios';
import { Citation } from '../components/SourcesCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export interface IndexingReport {
    success: boolean;
    pagesIndexed: number;
    chunksCreated: number;
    embeddingsGenerated: number;
    failedChunks: number;
    processingTime: string;
    collectionName: string;
}

export interface ChatResponse {
    success: boolean;
    answer: string;
    sources: Citation[];
    error?: string;
}

export const api = {
    async checkHealth(): Promise<boolean> {
        try {
            const res = await apiClient.get('/health');
            return res.data?.success === true;
        } catch {
            return false;
        }
    },

    async crawlWebsite(url: string): Promise<IndexingReport> {
        const response = await apiClient.post<IndexingReport>('/api/crawl', {
            url,
            depth: 0
        });
        return response.data;
    },

    async chat(question: string): Promise<ChatResponse> {
        const response = await apiClient.post<ChatResponse>('/api/chat', {
            question
        });
        return response.data;
    },

    async chatStream(
        question: string, 
        onChunk: (text: string) => void, 
        onSources: (sources: Citation[]) => void, 
        onError: (err: string) => void
    ): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            });

            if (!response.body) throw new Error('No readable stream');
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunkStr = decoder.decode(value, { stream: true });
                const lines = chunkStr.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6).trim();
                        if (dataStr === '[DONE]') {
                            return;
                        }
                        
                        try {
                            const parsed = JSON.parse(dataStr);
                            if (parsed.error) {
                                onError(parsed.error);
                            } else if (parsed.chunk) {
                                onChunk(parsed.chunk);
                            } else if (parsed.sources) {
                                onSources(parsed.sources);
                            }
                        } catch (e) {
                            // Ignored JSON parse errors for fragmented chunks
                        }
                    }
                }
            }
        } catch (error) {
            onError('Failed to connect to chat stream.');
        }
    }
};
