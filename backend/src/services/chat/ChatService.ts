import { GoogleGenAI } from '@google/genai';
import { Retriever } from './Retriever';
import { PromptBuilder } from './PromptBuilder';
import { ResponseFormatter, Citation } from './ResponseFormatter';

// AI client initialized dynamically to pick up latest env vars

export interface ChatResponse {
    success: boolean;
    answer: string;
    sources: Citation[];
    error?: string;
}

export class ChatService {
    static async handleChatStream(question: string, res: any): Promise<void> {
        let relevantChunks: any[] = [];
        try {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            if (!question || question.trim().length === 0) {
                res.write(`data: ${JSON.stringify({ error: 'Invalid or empty question.' })}\n\n`);
                res.end();
                return;
            }

            relevantChunks = await Retriever.getRelevantContext(question);

            if (relevantChunks.length === 0) {
                res.write(`data: ${JSON.stringify({ chunk: "I couldn't find this information on the crawled website." })}\n\n`);
                res.write(`data: ${JSON.stringify({ sources: [] })}\n\n`);
                res.write(`data: [DONE]\n\n`);
                res.end();
                return;
            }

            console.log('Calling Gemini Stream...');
            const apiKey = process.env.GEMINI_API_KEY;
            const ai = new GoogleGenAI({ apiKey: apiKey || 'placeholder' });
            const prompt = PromptBuilder.build(question, relevantChunks);
            
            let responseStream;
            let attempts = 0;
            const maxAttempts = 3;
            while (attempts < maxAttempts) {
                try {
                    responseStream = await ai.models.generateContentStream({
                        model: 'gemini-2.5-flash',
                        contents: prompt,
                    });
                    break;
                } catch (err: any) {
                    attempts++;
                    console.error(`Gemini stream attempt ${attempts} failed:`, err.message);
                    if (attempts >= maxAttempts) throw err;
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts - 1))); // Exponential backoff
                }
            }

            if (!responseStream) {
                throw new Error("Failed to initialize response stream after retries.");
            }

            let fullAnswer = '';

            for await (const chunk of responseStream) {
                const text = chunk.text;
                if (text) {
                    fullAnswer += text;
                    res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
                }
            }
            
            console.log('Formatting sources...');
            
            if (fullAnswer.includes("I couldn't find this information on the crawled website.")) {
                res.write(`data: ${JSON.stringify({ sources: [] })}\n\n`);
            } else {
                const formatted = ResponseFormatter.format(fullAnswer, relevantChunks);
                res.write(`data: ${JSON.stringify({ sources: formatted.sources })}\n\n`);
            }
            
            res.write(`data: [DONE]\n\n`);
            res.end();
            console.log('Stream Done.');
        } catch (error: any) {
            console.error('Chat error:', error);
            
            // Fallback for Rate Limits
            if (error?.status === 429 || error?.code === 429 || error?.message?.includes('quota') || error?.message?.includes('429')) {
                console.warn('Gemini Rate Limit hit. Mocking response.');
                const mockAnswer = "This is a simulated AI response. **You have exceeded your Gemini API quota (Rate Limit).** However, the backend pipeline successfully performed vector similarity search to find relevant context from the website! ";
                const words = mockAnswer.split(' ');
                for (const word of words) {
                    res.write(`data: ${JSON.stringify({ chunk: word + ' ' })}\n\n`);
                    await new Promise(r => setTimeout(r, 50));
                }
                
                if (relevantChunks && relevantChunks.length > 0) {
                    const formatted = ResponseFormatter.format(mockAnswer, relevantChunks);
                    res.write(`data: ${JSON.stringify({ sources: formatted.sources })}\n\n`);
                } else {
                    res.write(`data: ${JSON.stringify({ sources: [] })}\n\n`);
                }
                
                res.write(`data: [DONE]\n\n`);
                res.end();
                return;
            }

            // Fallback for API Key errors in sandbox
            if (error?.status === 400 || error?.status === 404 || error?.message?.includes('API key')) {
                console.warn('API Key missing or invalid. Mocking Gemini response stream.');
                const mockAnswer = "This is a simulated AI response. Since no valid Gemini API key is present in `.env`, the system is in demo mode. The backend pipeline successfully parsed, chunked, and embedded the website, and performed vector similarity search to find relevant context! ";
                const words = mockAnswer.split(' ');
                for (const word of words) {
                    res.write(`data: ${JSON.stringify({ chunk: word + ' ' })}\n\n`);
                    await new Promise(r => setTimeout(r, 50));
                }
                
                if (relevantChunks && relevantChunks.length > 0) {
                    const formatted = ResponseFormatter.format(mockAnswer, relevantChunks);
                    res.write(`data: ${JSON.stringify({ sources: formatted.sources })}\n\n`);
                } else {
                    res.write(`data: ${JSON.stringify({ sources: [] })}\n\n`);
                }
                
                res.write(`data: [DONE]\n\n`);
                res.end();
                return;
            }

            const errorMsg = error instanceof Error ? error.message : String(error);
            res.write(`data: ${JSON.stringify({ error: `Failed to generate response: ${errorMsg}` })}\n\n`);
            res.end();
        }
    }
}
