import { Routes, Route, Link } from 'react-router-dom';
import { ChatPage } from './pages/ChatPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CrawlProvider } from './hooks/useCrawl';

function App() {
    return (
        <CrawlProvider>
            <div className="min-h-screen w-full flex flex-col items-center bg-[#f8f6fd] text-slate-800 font-sans">
                <header className="w-full text-center pt-8 pb-4 flex justify-center gap-6 text-[15px] font-medium text-slate-500">
                    <Link to="/" className="hover:text-purple-600 transition-colors">Chat</Link>
                    <Link to="/analytics" className="hover:text-purple-600 transition-colors">Analytics</Link>
                </header>

                <div className="flex-1 w-full max-w-4xl px-4 sm:px-6 py-6 md:py-10 flex flex-col">
                    <Routes>
                        <Route path="/" element={<ChatPage />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                    </Routes>
                </div>
                
                <footer className="w-full text-center py-8 text-sm text-slate-400 flex justify-center">
                    <span>Powered by RAG & Gemini API 🚀</span>
                </footer>
            </div>
        </CrawlProvider>
    );
}

export default App;
