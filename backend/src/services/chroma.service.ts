import { ChromaClient, Collection } from 'chromadb';

interface MemDoc {
    id: string;
    text: string;
    embedding: number[];
    metadata: any;
}

class ChromaService {
    private client: ChromaClient;
    private collection: Collection | null = null;
    private readonly collectionName = 'website_chunks_v2';
    private isMemoryMode = false;
    private memoryDb: MemDoc[] = [];

    constructor() {
        const url = process.env.CHROMA_URL || 'http://localhost:8000';
        this.client = new ChromaClient({ path: url });
        
        // Detect Vercel or lack of Chroma configuration to default to memory mode early
        if (process.env.VERCEL || process.env.NODE_ENV === 'production' && !process.env.CHROMA_URL) {
            console.log('Detected Vercel/Production serverless environment. Initializing in-memory vector store.');
            this.isMemoryMode = true;
        }
    }

    private cosineSimilarity(vecA: number[], vecB: number[]): number {
        let dotProduct = 0.0;
        let normA = 0.0;
        let normB = 0.0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        if (normA === 0 || normB === 0) {
            return 0;
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    async initialize(): Promise<void> {
        if (this.isMemoryMode) {
            console.log('In-memory vector store initialized.');
            return;
        }
        try {
            console.log('Connecting to ChromaDB...');
            await this.getOrCreateCollection();
        } catch (e) {
            console.warn('⚠️ ChromaDB connection failed. Falling back to in-memory vector store.');
            this.isMemoryMode = true;
        }
    }

    async getOrCreateCollection(): Promise<Collection | null> {
        if (this.isMemoryMode) return null;
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
            console.error('Failed to get or create collection in ChromaDB, entering Memory Mode:', error);
            this.isMemoryMode = true;
            return null;
        }
    }

    async resetCollection(): Promise<void> {
        if (this.isMemoryMode) {
            this.memoryDb = [];
            console.log('In-memory vector store cleared.');
            return;
        }
        try {
            this.collection = null;
            await this.client.deleteCollection({ name: this.collectionName });
            console.log(`Collection ${this.collectionName} deleted (reset).`);
        } catch (error: any) {
            if (!String(error?.message).includes('does not exist') &&
                !String(error?.message).includes('not found')) {
                console.warn('Could not delete collection (may not exist yet):', error?.message);
            }
        }
        try {
            this.collection = await this.client.createCollection({
                name: this.collectionName,
                metadata: { "description": "Website chunks collection for RAG" }
            });
            console.log(`Collection ${this.collectionName} recreated.`);
        } catch (e) {
            console.error('Failed to recreate collection, entering Memory Mode:', e);
            this.isMemoryMode = true;
            this.memoryDb = [];
        }
    }

    async addDocuments(ids: string[], texts: string[], embeddings: number[][], metadatas: any[]): Promise<void> {
        if (this.isMemoryMode) {
            console.log(`Saving ${ids.length} chunks to in-memory vector store...`);
            for (let i = 0; i < ids.length; i++) {
                this.memoryDb.push({
                    id: ids[i],
                    text: texts[i],
                    embedding: embeddings[i],
                    metadata: metadatas[i]
                });
            }
            console.log('In-memory indexing complete.');
            return;
        }
        try {
            console.log(`Saving ${ids.length} chunks...`);
            const collection = await this.getOrCreateCollection();
            if (collection) {
                await collection.upsert({
                    ids,
                    embeddings,
                    documents: texts,
                    metadatas
                });
                console.log('Indexing complete.');
            }
        } catch (error) {
            console.error('Failed to add documents to ChromaDB, copying to Memory Mode:', error);
            this.isMemoryMode = true;
            await this.addDocuments(ids, texts, embeddings, metadatas);
        }
    }

    async query(questionEmbedding: number[], limit: number = 5): Promise<any> {
        if (this.isMemoryMode) {
            console.log('Searching in-memory collection...');
            const scoredDocs = this.memoryDb.map(doc => {
                const sim = this.cosineSimilarity(questionEmbedding, doc.embedding);
                // Convert similarity to pseudo-distance for L2 distance expectations
                const distance = sim > 0 ? (1 / sim) - 1 : 9999;
                return { doc, distance };
            });

            // Sort by distance ascending (closer matches first)
            scoredDocs.sort((a, b) => a.distance - b.distance);
            const results = scoredDocs.slice(0, limit);

            return {
                ids: [results.map(r => r.doc.id)],
                documents: [results.map(r => r.doc.text)],
                metadatas: [results.map(r => r.doc.metadata)],
                distances: [results.map(r => r.distance)]
            };
        }
        try {
            console.log('Searching collection...');
            const collection = await this.getOrCreateCollection();
            if (collection) {
                const results = await collection.query({
                    queryEmbeddings: [questionEmbedding],
                    nResults: limit
                });
                const count = results.ids[0]?.length || 0;
                console.log(`Retrieved ${count} documents.`);
                return results;
            }
            throw new Error('Collection not initialized');
        } catch (error) {
            console.error('Failed to query ChromaDB:', error);
            throw error;
        }
    }

    async deleteCollection(): Promise<void> {
        if (this.isMemoryMode) {
            this.memoryDb = [];
            return;
        }
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
        if (this.isMemoryMode) return true;
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
