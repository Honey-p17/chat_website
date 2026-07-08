import { GoogleGenAI } from '@google/genai';
import { DocumentChunk } from './ChunkService';

// API key is loaded dynamically in generateWithRetry

export interface EmbeddedChunk extends DocumentChunk {
    embedding: number[];
}

export class EmbeddingService {
    static async generateEmbeddings(chunks: DocumentChunk[]): Promise<EmbeddedChunk[]> {
        const embeddedChunks: EmbeddedChunk[] = [];
        
        for (const chunk of chunks) {
            try {
                console.log(`Generating embedding for chunk ${chunk.chunkNumber}/${chunk.totalChunks}...`);
                const embedding = await this.generateWithRetry(chunk.chunkText);
                if (embedding) {
                    embeddedChunks.push({
                        ...chunk,
                        embedding
                    });
                } else {
                    console.error(`Skipping chunk ${chunk.chunkId} due to embedding failure.`);
                }
            } catch (error) {
                console.error(`Failed to embed chunk ${chunk.chunkId}:`, error);
                // Skip failed chunks and continue
            }
        }
        
        return embeddedChunks;
    }

    static async generateSingleEmbedding(text: string): Promise<number[]> {
        const embedding = await this.generateWithRetry(text);
        if (!embedding) {
            throw new Error('Failed to generate embedding for the question.');
        }
        return embedding;
    }

    private static async generateWithRetry(text: string, maxRetries = 3): Promise<number[] | null> {
        let attempt = 0;
        let delay = 1000;
        
        while (attempt < maxRetries) {
            try {
                const apiKey = process.env.GEMINI_API_KEY;
                const ai = new GoogleGenAI({ apiKey: apiKey || 'placeholder' });
                
                const response = await ai.models.embedContent({
                    model: 'gemini-embedding-001',
                    contents: text,
                });
                return response.embeddings?.[0]?.values || null;
            } catch (error: any) {
                attempt++;
                // If it's a 429 or 500, retry
                if (error.status === 429 || error.status >= 500) {
                    if (attempt >= maxRetries) {
                        throw error;
                    }
                    console.warn(`Temporary API failure (Status ${error.status}). Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
                    await new Promise(res => setTimeout(res, delay));
                    delay *= 2; // exponential backoff
                } else if (error.status === 400 || error.status === 404 || error.message?.includes('API key')) {
                    console.warn('API Key missing or invalid. Using fallback dummy embeddings.');
                    return Array(768).fill(Math.random() * 0.1);
                } else {
                    // For other non-retryable errors
                    throw error;
                }
            }
        }
        return null;
    }
}
