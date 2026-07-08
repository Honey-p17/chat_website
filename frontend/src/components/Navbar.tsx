import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Bot, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
    const location = useLocation();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
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
            setIsDark(false);
        } else {
            root.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200/60 dark:border-gray-800/60">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                        WebChat<span className="text-purple-600">AI</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-1">
                    <Link 
                        to="/"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            location.pathname === '/' 
                                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        Chat
                    </Link>
                    <Link 
                        to="/analytics"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                            location.pathname === '/analytics' 
                                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                    </Link>
                    
                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />

                    <button 
                        onClick={toggleTheme}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
