import { Lightbulb } from 'lucide-react';

interface SuggestedQuestionsProps {
    onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
    const questions = [
        "What does this company do?",
        "Summarize this website in 3 sentences.",
        "What products or services are offered?",
        "How can I contact the company?"
    ];

    return (
        <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Try asking</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {questions.map((q, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelect(q)}
                        className="text-left px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all text-sm text-gray-700 dark:text-gray-300 font-medium group"
                    >
                        <span className="group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">{q}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
