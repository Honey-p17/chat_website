import { RetrievedChunk } from './SimilarityService';

export class PromptBuilder {
    static build(question: string, chunks: RetrievedChunk[]): string {
        const contextString = chunks.map((chunk, index) => {
            return `--- Source ${index + 1} ---
Title: ${chunk.title}
URL: ${chunk.url}
Snippet: ${chunk.text}`;
        }).join('\n\n');

        return `You are a helpful and professional assistant answering questions based purely on the provided context from a crawled website.

RULES:
1. ONLY answer using the retrieved context provided below.
2. NEVER invent information or use outside knowledge.
3. If the answer is unavailable in the context, reply EXACTLY with: "I couldn't find this information on the crawled website."
4. Be concise and accurate.
5. Always stay grounded in the provided sources.
6. Do not include phrases like "According to the sources" in your response. Just answer the question.
7. Do not present obvious placeholder values (e.g., bare "0+", "0", "N/A", empty stat labels) as real answers. If the actual number is missing or looks like an unrendered JS counter, treat it as unavailable and reply EXACTLY with: "I couldn't find this information on the crawled website."

CONTEXT:
${contextString}

USER QUESTION:
${question}

ANSWER:`;
    }
}
