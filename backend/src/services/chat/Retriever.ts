import { SimilarityService, RetrievedChunk } from './SimilarityService';

export class Retriever {
    // A relatively low threshold to ensure we catch most things, but filter out pure noise.
    // This value would be tuned based on real embedding behavior.
    private static SIMILARITY_THRESHOLD = 0.2; 

    static async getRelevantContext(question: string): Promise<RetrievedChunk[]> {
        const allChunks = await SimilarityService.search(question, 5);
        
        const relevantChunks = allChunks.filter(chunk => chunk.similarity >= this.SIMILARITY_THRESHOLD);
        
        console.log(`Retrieved ${allChunks.length} chunks. ${relevantChunks.length} passed similarity threshold.`);
        return relevantChunks;
    }
}
