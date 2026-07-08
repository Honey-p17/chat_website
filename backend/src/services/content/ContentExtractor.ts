import * as cheerio from 'cheerio';

export interface PageMetadata {
  pageTitle: string;
  url: string;
  depth: number;
  wordCount: number;
  characterCount: number;
  crawledTimestamp: string;
  sourceDomain: string;
}

export class ContentExtractor {
    static extractHTML(rawHtml: string, url: string, depth: number): { title: string; mainHtml: string; metadata: PageMetadata } {
        const $ = cheerio.load(rawHtml);
        
        // Remove noise
        $('header, footer, nav, aside, script, style, noscript, svg, iframe, .cookie-banner, #cookie-banner, .ads, .ad-banner, .social-links, .newsletter').remove();
        
        const title = $('title').text().trim() || 'Untitled Page';
        
        let mainContent = $('main');
        if (mainContent.length === 0) {
            mainContent = $('article');
        }
        if (mainContent.length === 0) {
            mainContent = $('body');
        }

        const rawText = mainContent.text() || '';
        const characterCount = rawText.length;
        const wordCount = rawText.split(/\s+/).filter(w => w.length > 0).length;
        
        let sourceDomain = 'unknown';
        try {
            sourceDomain = new URL(url).hostname;
        } catch (e) {
            // invalid URL
        }

        const metadata: PageMetadata = {
            pageTitle: title,
            url,
            depth,
            wordCount,
            characterCount,
            crawledTimestamp: new Date().toISOString(),
            sourceDomain
        };
        
        return {
            title,
            mainHtml: mainContent.html() || '',
            metadata
        };
    }
}
