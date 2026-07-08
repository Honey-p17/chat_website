import { Request, Response } from 'express';
import { IndexingService } from '../services/content/IndexingService';

export const crawlAndIndex = async (req: Request, res: Response): Promise<void> => {
    try {
        const { url } = req.body;

        if (!url) {
            res.status(400).json({ error: 'Missing url in request body.' });
            return;
        }

        // Trigger the multi-page domain crawler
        const report = await IndexingService.crawlAndIndexDomain(url);

        if (!report.success) {
            res.status(500).json({ 
                error: report.errorDetails ? `Indexing failed: ${report.errorDetails}` : 'Failed to index the website completely.', 
                report 
            });
            return;
        }

        res.status(200).json(report);
    } catch (error) {
        console.error('Crawl Controller Error:', error);
        res.status(500).json({ error: 'An internal server error occurred during crawling.' });
    }
};
