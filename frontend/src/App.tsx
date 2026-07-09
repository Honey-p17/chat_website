import { Routes, Route, Link } from 'react-router-dom';
import { ChatPage } from './pages/ChatPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

function App() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-[#f8f6fd] text-slate-800 font-sans">
            <div className="flex-1 w-full max-w-4xl px-4 sm:px-6 py-12 md:py-20 flex flex-col">
                <Routes>
                    <Route path="/" element={<ChatPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                </Routes>
            </div>
            
            <footer className="w-full text-center py-8 text-sm text-slate-400 flex justify-center gap-4">
                <span>Powered by RAG & Gemini API 🚀</span>
                <span>•</span>
                <Link to="/analytics" className="hover:text-purple-500 transition-colors">Analytics</Link>
                <span>•</span>
                <Link to="/" className="hover:text-purple-500 transition-colors">Chat</Link>
            </footer>
        </div>
    );
}

export default App;
