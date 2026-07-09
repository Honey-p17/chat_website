import { ChromaClient, Collection } from 'chromadb';

class ChromaService {
    private client: ChromaClient;
    private collection: Collection | null = null;
    private readonly collectionName = 'website_chunks_v2';

    constructor() {
        const url = process.env.CHROMA_URL || 'http://localhost:8000';
        this.client = new ChromaClient({ path: url });
    }

    async initialize(): Promise<void> {
        console.log('Connecting to ChromaDB...');
        await this.getOrCreateCollection();
    }

    async getOrCreateCollection(): Promise<Collection> {
        if (this.collection) {
            return this.collection;
        }
        try {
            this.collection = await this.client.getOrCreateCollection({
                name: this.collectionName,
                metadata: { "description": "Website chunks collection for RAG" }
            });
            console.log('Collection found.');
            return this.collection;
        } catch (error) {
            console.error('Failed to get or create collection in ChromaDB:', error);
            throw error;
        }
    }

    /**
     * Drop and recreate the collection so a new crawl always starts clean.
     * This prevents chunks from a previous site leaking into retrieval for a
     * different site — the core data-isolation requirement.
     */
    async resetCollection(): Promise<void> {
        try {
            // Invalidate cached reference first
            this.collection = null;
            await this.client.deleteCollection({ name: this.collectionName });
            console.log(`Collection ${this.collectionName} deleted (reset).`);
        } catch (error: any) {
            // If it didn't exist yet, that is fine — just proceed
            if (!String(error?.message).includes('does not exist') &&
                !String(error?.message).includes('not found')) {
                console.warn('Could not delete collection (may not exist yet):', error?.message);
            }
        }
        this.collection = await this.client.createCollection({
            name: this.collectionName,
            metadata: { "description": "Website chunks collection for RAG" }
        });
        console.log(`Collection ${this.collectionName} recreated.`);
    }

    async addDocuments(ids: string[], texts: string[], embeddings: number[][], metadatas: any[]): Promise<void> {
        try {
            console.log(`Saving ${ids.length} chunks...`);
            const collection = await this.getOrCreateCollection();
            await collection.upsert({
                ids,
                embeddings,
                documents: texts,
                metadatas
            });
            console.log('Indexing complete.');
        } catch (error) {
            console.error('Failed to add documents to ChromaDB:', error);
            throw error;
        }
    }

    async query(questionEmbedding: number[], limit: number = 5): Promise<any> {
        try {
            console.log('Searching collection...');
            const collection = await this.getOrCreateCollection();
            const results = await collection.query({
                queryEmbeddings: [questionEmbedding],
                nResults: limit
            });
            const count = results.ids[0]?.length || 0;
            console.log(`Retrieved ${count} documents.`);
            return results;
        } catch (error) {
            console.error('Failed to query ChromaDB:', error);
            throw error;
        }
    }

    async deleteCollection(): Promise<void> {
        try {
            await this.client.deleteCollection({ name: this.collectionName });
            this.collection = null;
            console.log(`Collection ${this.collectionName} deleted.`);
        } catch (error) {
            console.error('Failed to delete collection:', error);
            throw error;
        }
    }

    async healthCheck(): Promise<boolean> {
        try {
            const heartbeat = await this.client.heartbeat();
            return typeof heartbeat === 'number';
        } catch (error) {
            console.error('ChromaDB health check failed:', error);
            return false;
        }
    }
}

export const chromaService = new ChromaService();
