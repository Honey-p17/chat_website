import * as cheerio from 'cheerio';

export class TextCleaner {
    static clean(html: string): string {
        const $ = cheerio.load(html);
        let text = $.text();
        
        // Normalize whitespace
        text = text.replace(/[ \t]+/g, ' ');
        // Remove repeated blank lines
        text = text.replace(/\n\s*\n+/g, '\n\n');
        
        return text.trim();
    }
}
