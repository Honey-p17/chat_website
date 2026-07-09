import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Moon, Sun, Bot } from 'lucide-react';

export function Navbar() {
    const location = useLocation();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && prefersDark)) {
            root.classList.add('dark');
            setIsDark(true);
        } else {
            root.classList.remove('dark');
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            root.classList.add('dark');
            localStorage.theme = 'dark';
        }
        setIsDark(!isDark);
    };

    const navLinks = [
        { label: 'Chat',      path: '/' },
        { label: 'Analytics', path: '/analytics' },
    ];

    return (
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-2 font-semibold text-gray-900 hover:opacity-75 transition-opacity">
                    <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    WebChat
                </Link>

                {/* Nav + theme toggle */}
                <nav className="flex items-center gap-1">
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
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                </nav>
            </div>
        </header>
    );
}
