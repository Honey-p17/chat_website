export function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white mt-auto">
            <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                    Powered by React · Gemini 2.5 Flash · ChromaDB
                </p>
                <p className="text-xs text-gray-300">{new Date().getFullYear()}</p>
            </div>
        </footer>
    );
}
