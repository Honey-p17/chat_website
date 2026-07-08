import crypto from 'crypto';

export interface DocumentChunk {
    chunkId: string;
    pageId: string;
    chunkText: string;
    title: string;
    url: string;
    chunkNumber: number;
    totalChunks: number;
    wordCount: number;
}

export class ChunkService {
    private static TARGET_WORDS = 500;
    private static OVERLAP_WORDS = 100;

    static chunkText(text: string, title: string, url: string): DocumentChunk[] {
        // Split text into sentences using simple regex (not perfect, but works for plain text)
        const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [text];
        
        const chunks: string[] = [];
        let currentChunkSentences: string[] = [];
        let currentWordCount = 0;

        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i];
            const sentenceWordCount = this.countWords(sentence);
            
            if (currentWordCount + sentenceWordCount > this.TARGET_WORDS && currentChunkSentences.length > 0) {
                // Save current chunk
                chunks.push(currentChunkSentences.join(''));
                
                // Keep the last sentences to form the overlap
                let overlapSentences: string[] = [];
                let overlapWordCount = 0;
                
                for (let j = currentChunkSentences.length - 1; j >= 0; j--) {
                    const prevSentence = currentChunkSentences[j];
                    const prevWordCount = this.countWords(prevSentence);
                    if (overlapWordCount + prevWordCount <= this.OVERLAP_WORDS || overlapSentences.length === 0) {
                        overlapSentences.unshift(prevSentence);
                        overlapWordCount += prevWordCount;
                    } else {
                        break;
                    }
                }
                
                currentChunkSentences = [...overlapSentences, sentence];
                currentWordCount = overlapWordCount + sentenceWordCount;
            } else {
                currentChunkSentences.push(sentence);
                currentWordCount += sentenceWordCount;
            }
        }
        
        if (currentChunkSentences.length > 0) {
            chunks.push(currentChunkSentences.join(''));
        }

        const pageId = crypto.createHash('md5').update(url).digest('hex');

        return chunks.map((chunkText, index) => {
            const cleanChunkText = chunkText.trim();
            const wordCount = this.countWords(cleanChunkText);
            
            return {
                chunkId: `${pageId}-${index + 1}`,
                pageId,
                chunkText: cleanChunkText,
                title,
                url,
                chunkNumber: index + 1,
                totalChunks: chunks.length,
                wordCount
            };
        });
    }

    private static countWords(text: string): number {
        return text.trim().split(/\s+/).filter(w => w.length > 0).length;
    }
}
