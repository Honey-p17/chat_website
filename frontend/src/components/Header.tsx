import { Bot } from 'lucide-react';

export function Header() {
    return (
        <header className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
                <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
                Chat with a Website
            </h1>
            <p className="text-lg text-gray-500 max-w-xl">
                Ask questions about any website using AI. Powered by Retrieval-Augmented Generation, Gemini, and ChromaDB.
            </p>
        </header>
    );
}
