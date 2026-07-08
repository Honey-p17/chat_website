# Chat with a Website - Full Stack RAG Application

A polished, production-ready full stack web application that allows users to provide any website URL, gracefully crawls and extracts the text content, generates embeddings using Google Gemini API, stores the vectors into ChromaDB, and provides a ChatGPT/Perplexity-like interface to ask questions against the localized knowledge base.

## Project Overview

This project is built around the **Retrieval-Augmented Generation (RAG)** architecture. It acts as a specialized search engine and intelligent assistant for individual websites. By leveraging vector similarity searches, the application ensures that the Large Language Model (Gemini 1.5 Flash) answers questions *strictly* using grounded facts extracted during the crawling phase, effectively eliminating hallucinations.

## Architecture & Tech Stack

### Frontend
- **React 18** (Bootstrapped via Vite)
- **TypeScript** (Strict Mode)
- **Tailwind CSS** (Modern, clean UI with soft shadows, responsive grids, and typography)
- **Lucide-React** (Minimalist iconography)
- **Axios** (API bridging)

### Backend
- **Node.js + Express.js**
- **TypeScript** (Strongly typed services and controllers)
- **Cheerio** (DOM parsing, boilerplate pruning, and content extraction)
- **@google/genai** (Integration with Gemini models `text-embedding-004` and `gemini-1.5-flash`)
- **ChromaDB** (Local Vector Database)

## Folder Structure

```
d:/RAG_assignment 1/
├── frontend/                     # React UI Application
│   ├── src/
│   │   ├── components/           # Reusable modular UI components (ChatWindow, WebsiteInput, etc.)
│   │   ├── lib/                  # Utilities (e.g., tailwind merge)
│   │   ├── services/             # Axios API client definitions
│   │   ├── App.tsx               # Main orchestration view
│   │   └── main.tsx              # React DOM entry point
│   └── ...config files (tailwind, postcss, tsconfig, etc.)
│
├── backend/                      # Express RAG API
│   ├── src/
│   │   ├── controllers/          # HTTP Request handlers (crawlController, chatController)
│   │   ├── middleware/           # Express middlewares (errors, not found, logging)
│   │   ├── routes/               # API route definitions
│   │   ├── services/
│   │   │   ├── chat/             # Prompt engineering, Chat orchestration, Response formatting, Retriever
│   │   │   ├── content/          # Chunking, Extractor, HTML cleaning, Indexing pipeline, Embeddings
│   │   │   └── vector/           # ChromaDB integration
│   │   ├── app.ts                # Express application bootstrap
│   │   └── server.ts             # Server entry point
│   └── ...config files (tsconfig, package.json, etc.)
```

## How It Works

### 1. Crawling & Extraction
When a URL is submitted via `POST /api/crawl`, the backend fetches the raw HTML. It utilizes Cheerio to aggressively remove noise (navbars, footers, scripts, ads, cookie banners) and extracts pure text from main semantic tags (`<main>`, `<article>`, `<body>`). It computes rich metadata (character count, depth, timestamp).

### 2. Chunking
The clean text passes into `ChunkService.ts` where it is intelligently split along sentence boundaries into chunks of ~500 words, utilizing an ~80-100 word sliding overlap to prevent contextual loss at chunk borders.

### 3. Embeddings
`EmbeddingService.ts` iterates over the chunks and requests high-dimensional vector representations from the Google Gemini API (`text-embedding-004`). It implements exponential backoff to handle rate limits (HTTP 429) gracefully.

### 4. Vector Storage
The embedded chunks, paired with their raw text and metadata citations, are bulk-upserted into a local ChromaDB collection named `website_chunks`.

### 5. Retrieval & RAG (Chat)
When a question is submitted via `POST /api/chat`:
1. The user's question is instantly converted into an embedding.
2. ChromaDB performs a similarity search, retrieving the top 5 nearest chunks.
3. A `Retriever` discards any chunks falling below a strict similarity threshold.
4. If valid chunks exist, they are injected into a highly constrained Prompt template.
5. `gemini-1.5-flash` processes the prompt and returns a strictly grounded answer.
6. The backend formats the response and deduplicates source URL citations before pushing them to the UI.

## API Endpoints

- **`GET /health`**: Returns backend availability status.
- **`POST /api/crawl`**: Accepts `{ url, html, depth }`. Orchestrates crawling, chunking, and embedding. Returns an `IndexingReport`.
- **`POST /api/chat`**: Accepts `{ question }`. Returns `{ success, answer, sources }`.

## Installation & Running Locally

### Prerequisites
- Node.js (v18+)
- ChromaDB running locally (typically Docker: `docker run -p 8000:8000 chromadb/chroma`)
- A Google Gemini API Key

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` file:
   ```env
   PORT=5000
   CHROMA_URL=http://localhost:8000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. `npm run dev`

## Limitations
- The crawler is implemented using simple Axios GET requests, meaning it does not execute client-side JavaScript. Highly dynamic Single Page Applications (SPAs) might require an integration with Puppeteer/Playwright in the future.
- Chunk overlaps are currently estimated by splitting on primitive sentence regex markers, which could struggle against complex semantic abbreviations.

## Future Improvements
- **WebSockets / Server-Sent Events (SSE):** Streaming the AI responses token-by-token directly to the frontend for better perceived performance.
- **GraphRAG:** Mapping knowledge graphs between chunks to answer holistic, multi-hop queries across the domain rather than strict localized chunks.
- **Playwright Crawler Integration:** Handling headless browser crawling for modern JS-heavy sites.
