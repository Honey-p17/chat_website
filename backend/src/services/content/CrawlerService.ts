import axios from 'axios';
import * as cheerio from 'cheerio';
import robotsParser from 'robots-parser';

export interface CrawledPage {
    url: string;
    html: string;
}

export class CrawlerService {
    private static MAX_PAGES = 2;
    private static DELAY_MS = 1000;

    static async crawlDomain(startUrl: string, maxPages = CrawlerService.MAX_PAGES): Promise<CrawledPage[]> {
        const urlObj = new URL(startUrl);
        const domain = urlObj.origin;
        const robotsUrl = `${domain}/robots.txt`;

        console.log(`Fetching robots.txt from ${robotsUrl}...`);
        let robotsTxt = '';
        try {
            const robotsRes = await axios.get(robotsUrl, { timeout: 5000 });
            robotsTxt = robotsRes.data;
        } catch (e) {
            console.log('No robots.txt found or accessible, proceeding with caution.');
        }

        const robots = robotsParser(robotsUrl, robotsTxt);
        const userAgent = 'ChatbotCrawler/1.0';

        const queue: string[] = [startUrl];
        const visited = new Set<string>();
        const pages: CrawledPage[] = [];

        while (queue.length > 0 && pages.length < maxPages) {
            const currentUrl = queue.shift()!;
            
            if (visited.has(currentUrl)) continue;
            visited.add(currentUrl);

            // Respect robots.txt
            if (robotsTxt && !robots.isAllowed(currentUrl, userAgent)) {
                console.log(`[Crawler] Disallowed by robots.txt: ${currentUrl}`);
                continue;
            }

            console.log(`[Crawler] Fetching: ${currentUrl}`);
            try {
                const response = await axios.get(currentUrl, {
                    headers: { 'User-Agent': userAgent },
                    timeout: 10000
                });

                const html = response.data;
                pages.push({ url: currentUrl, html });

                // Extract same-domain links
                const $ = cheerio.load(html);
                $('a').each((_, element) => {
                    const href = $(element).attr('href');
                    if (href) {
                        try {
                            const nextUrl = new URL(href, domain);
                            // Ensure same domain and only http/https
                            if (nextUrl.origin === domain && nextUrl.protocol.startsWith('http')) {
                                // Remove hash fragments
                                nextUrl.hash = '';
                                const cleanUrl = nextUrl.toString();
                                if (!visited.has(cleanUrl)) {
                                    queue.push(cleanUrl);
                                }
                            }
                        } catch (err) {
                            // Invalid URL, ignore
                        }
                    }
                });

                // Politeness delay
                if (queue.length > 0 && pages.length < maxPages) {
                    await new Promise(resolve => setTimeout(resolve, CrawlerService.DELAY_MS));
                }

            } catch (error) {
                console.error(`[Crawler] Failed to fetch ${currentUrl}:`, error instanceof Error ? error.message : String(error));
            }
        }

        console.log(`[Crawler] Completed. Fetched ${pages.length} pages.`);
        return pages;
    }
}
