import { ContentExtractor } from './ContentExtractor';
import { ChunkService } from './ChunkService';
import { EmbeddingService } from './EmbeddingService';
import { chromaService } from '../chroma.service';
import { TextCleaner } from './TextCleaner';
import { CrawlerService } from './CrawlerService';

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

export class IndexingService {
    static async crawlAndIndexDomain(startUrl: string, collectionName = 'website_chunks'): Promise<IndexingReport> {
        const startTime = Date.now();
        console.log(`\n--- Starting BFS Indexing for ${startUrl} ---`);

        try {
            // 0. Reset the collection to prevent cross-site data contamination.
            //    Every new crawl gets a clean slate — chunks from the previous
            //    site are deleted before the new site is indexed.
            await chromaService.resetCollection();

            // 1. Crawl Domain
            const pages = await CrawlerService.crawlDomain(startUrl, 5);
            if (pages.length === 0) {
                throw new Error('No pages crawled.');
            }

            let totalChunksCreated = 0;
            let totalEmbeddings = 0;
            let totalFailed = 0;

            // 2 & 3 & 4. Process each page sequentially
            for (const page of pages) {
                console.log(`Processing page: ${page.url}`);
                const extracted = ContentExtractor.extractHTML(page.html, page.url, 0);
                const cleanText = TextCleaner.clean(extracted.mainHtml);
                
                if (cleanText.length < 50) {
                    console.warn(`Page content too small for ${page.url}. Skipping.`);
                    continue;
                }

                const chunks = ChunkService.chunkText(cleanText, extracted.title, page.url);
                totalChunksCreated += chunks.length;

                if (chunks.length === 0) continue;

                const embeddedChunks = await EmbeddingService.generateEmbeddings(chunks);
                totalEmbeddings += embeddedChunks.length;
                totalFailed += (chunks.length - embeddedChunks.length);
                
                if (embeddedChunks.length > 0) {
                    const ids = embeddedChunks.map(c => c.chunkId);
                    const texts = embeddedChunks.map(c => c.chunkText);
                    const embeddings = embeddedChunks.map(c => c.embedding);
                    const metadatas = embeddedChunks.map(c => ({
                        url: c.url,
                        title: c.title,
                        chunkNumber: c.chunkNumber,
                        pageId: c.pageId,
                        wordCount: c.wordCount,
                        createdAt: new Date().toISOString()
                    }));

                    await chromaService.addDocuments(ids, texts, embeddings, metadatas);
                }
            }

            console.log('Index completed.\n');

            return this.generateReport(
                true, 
                pages.length, 
                totalChunksCreated, 
                totalEmbeddings, 
                totalFailed, 
                startTime, 
                collectionName
            );
        } catch (error: any) {
            console.error('Indexing failed:', error);
            const report = this.generateReport(false, 0, 0, 0, 0, startTime, collectionName);
            report.errorDetails = error instanceof Error ? error.message : String(error);
            return report;
        }
    }

    private static generateReport(
        success: boolean,
        pagesIndexed: number,
        chunksCreated: number,
        embeddingsGenerated: number,
        failedChunks: number,
        startTime: number,
        collectionName: string
    ): IndexingReport {
        const timeTakenMs = Date.now() - startTime;
        return {
            success,
            pagesIndexed,
            chunksCreated,
            embeddingsGenerated,
            failedChunks,
            processingTime: `${timeTakenMs}ms`,
            collectionName
        };
    }
}
