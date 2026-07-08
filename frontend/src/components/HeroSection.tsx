import { Star, Sparkles } from 'lucide-react';

export function HeroSection() {
    return (
        <div className="relative flex flex-col items-center text-center px-4 animate-fade-in-up">
            {/* Soft gradient blob behind everything */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-purple-200/40 via-indigo-200/30 to-pink-200/20 dark:from-purple-900/20 dark:via-indigo-900/15 dark:to-pink-900/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Badges row */}
            <div className="relative flex flex-wrap items-center justify-center gap-3 mb-8">
                <div className="flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-full shadow-sm">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                        <span className="text-[9px] font-black text-white">G</span>
                    </div>
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Reviews</span>
                </div>

                <div className="flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-full shadow-sm">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <span className="text-[9px] font-black text-white">P</span>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">#3 Product of the Day</span>
                    <Sparkles className="w-3 h-3 text-orange-400" />
                </div>
            </div>

            {/* Main heading */}
            <h1 className="relative text-4xl sm:text-5xl md:text-[56px] font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1] max-w-3xl">
                Create smart AI chatbots that
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"> understand </span>
                your website
            </h1>

            {/* Subtitle */}
            <p className="relative mt-5 text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
                Paste your website URL to preview and create a fully functioning AI agent
            </p>
        </div>
    );
}
