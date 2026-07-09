import { Link, useLocation } from 'react-router-dom';
import { Bot } from 'lucide-react';

export function Navbar() {
    const location = useLocation();

    const navLinks = [
        { label: 'Chat',      path: '/' },
        { label: 'Analytics', path: '/analytics' },
    ];

    return (
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-2 font-semibold text-gray-900 hover:opacity-70 transition-opacity">
                    <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    WebChat
                </Link>

                {/* Nav links only — no theme toggle */}
                <nav className="flex items-center gap-0.5">
                    {navLinks.map(({ label, path }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                location.pathname === path
                                    ? 'bg-violet-50 text-violet-700'
                                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
