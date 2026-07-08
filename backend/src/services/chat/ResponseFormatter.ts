import { RetrievedChunk } from './SimilarityService';

export interface Citation {
    title: string;
    url: string;
    snippet: string;
}

export class ResponseFormatter {
    static format(answer: string, chunks: RetrievedChunk[]): { answer: string; sources: Citation[] } {
        // Prevent duplicate sources based on URL
        const uniqueSourcesMap = new Map<string, Citation>();
        
        for (const chunk of chunks) {
            if (!uniqueSourcesMap.has(chunk.url)) {
                // Return a concise snippet (e.g., first 150 characters)
                let snippet = chunk.text.trim();
                if (snippet.length > 150) {
                    snippet = snippet.substring(0, 150) + '...';
                }
                
                uniqueSourcesMap.set(chunk.url, {
                    title: chunk.title,
                    url: chunk.url,
                    snippet
                });
            }
        }

        return {
            answer,
            sources: Array.from(uniqueSourcesMap.values())
        };
    }
}
