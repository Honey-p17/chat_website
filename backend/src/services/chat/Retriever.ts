import { SimilarityService, RetrievedChunk } from './SimilarityService';
import { GoogleGenAI } from '@google/genai';

export class Retriever {
    // A relatively low threshold to ensure we catch most things, but filter out pure noise.
    // This value would be tuned based on real embedding behavior.
    private static SIMILARITY_THRESHOLD = 0.2; 

    static async getRelevantContext(question: string): Promise<RetrievedChunk[]> {
        let searchQuery = question;
        
        // Expand very short queries
        const wordCount = question.trim().split(/\s+/).length;
        if (wordCount <= 5) {
            console.log(`Query is short (${wordCount} words). Expanding query...`);
            try {
                const apiKey = process.env.GEMINI_API_KEY;
                if (apiKey) {
                    const ai = new GoogleGenAI({ apiKey });
                    const prompt = `You are a search expert. The user asked a very short or vague question about a company or website: "${question}". Reformulate this into a clear, complete, and specific question suitable for semantic search in a knowledge base. Do not answer the question, just output the reformulated question. Keep it concise and under 15 words.`;
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: prompt,
                    });
                    if (response.text) {
                        searchQuery = response.text.trim();
                        console.log(`Expanded query to: "${searchQuery}"`);
                    }
                }
            } catch (error) {
                console.error('Failed to expand query, falling back to original:', error);
            }
        }

        const allChunks = await SimilarityService.search(searchQuery, 10);
        
        const relevantChunks = allChunks.filter(chunk => chunk.similarity >= this.SIMILARITY_THRESHOLD);
        
        console.log(`Retrieved ${allChunks.length} chunks. ${relevantChunks.length} passed similarity threshold.`);
        return relevantChunks;
    }
}
