import { chromaService } from '../chroma.service';
import { EmbeddingService } from '../content/EmbeddingService';

export interface RetrievedChunk {
    chunkId: string;
    text: string;
    similarity: number;
    title: string;
    url: string;
}

export class SimilarityService {
    static async search(question: string, limit: number = 5): Promise<RetrievedChunk[]> {
        console.log('Generating query embedding...');
        const queryEmbedding = await EmbeddingService.generateSingleEmbedding(question);
        
        console.log('Searching ChromaDB...');
        const results = await chromaService.query(queryEmbedding, limit);
        
        const chunks: RetrievedChunk[] = [];
        if (results.ids && results.ids.length > 0 && results.ids[0]) {
            for (let i = 0; i < results.ids[0].length; i++) {
                const distance = (results.distances && results.distances[0][i] != null) ? results.distances[0][i] as number : 0;
                // Assuming L2 distance (Chroma default). Convert to a 0-1 similarity score.
                const similarity = 1 / (1 + distance); 
                
                chunks.push({
                    chunkId: results.ids[0][i],
                    text: results.documents[0][i] as string || '',
                    similarity,
                    title: results.metadatas[0][i]?.title as string || 'Unknown Title',
                    url: results.metadatas[0][i]?.url as string || '#'
                });
            }
        }
        
        return chunks;
    }
}
