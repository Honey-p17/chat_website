export function Footer() {
    return (
        <footer className="w-full py-5 border-t border-gray-200/60 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/50">
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                    Powered by <span className="font-medium text-gray-600 dark:text-gray-300">React</span> · <span className="font-medium text-gray-600 dark:text-gray-300">Gemini 2.5 Flash</span> · <span className="font-medium text-gray-600 dark:text-gray-300">ChromaDB</span>
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                    © {new Date().getFullYear()} WebChatAI
                </p>
            </div>
        </footer>
    );
}
