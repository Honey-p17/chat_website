import { Check } from 'lucide-react';

interface ProgressChecklistProps {
    simulatedStep: number;
}

export function ProgressChecklist({ simulatedStep }: ProgressChecklistProps) {
    if (simulatedStep === 0) return null;

    return (
        <div className="w-full rounded-xl bg-[#f8f7fc] p-5 flex flex-col gap-4">
            <StepItem 
                label="Crawling Website" 
                state={simulatedStep > 1 ? 'done' : simulatedStep === 1 ? 'active' : 'pending'} 
            />
            <StepItem 
                label="Extracting Content" 
                state={simulatedStep > 2 ? 'done' : simulatedStep === 2 ? 'active' : 'pending'} 
            />
            <StepItem 
                label="Generating Embeddings" 
                state={simulatedStep > 3 ? 'done' : simulatedStep === 3 ? 'active' : 'pending'} 
            />
            <StepItem 
                label="Ready For Questions" 
                state={simulatedStep === 4 ? 'done' : 'pending'} 
            />
        </div>
    );
}

function StepItem({ label, state }: { label: string, state: 'pending' | 'active' | 'done' }) {
    return (
        <div className={`flex items-center gap-3 text-[15px] font-medium transition-colors ${state === 'pending' ? 'text-slate-300' : 'text-slate-700'}`}>
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {state === 'done' && (
                    <div className="w-4 h-4 rounded-[4px] bg-[#22c55e] flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                    </div>
                )}
                {state === 'active' && (
                    <div className="w-4 h-4 rounded-full border-2 border-[#8B5CF6]/20 border-t-[#8B5CF6] animate-spin" />
                )}
                {state === 'pending' && (
                    <div className="w-4 h-4 rounded-[4px] bg-slate-200/50" />
                )}
            </div>
            {label}
        </div>
    );
}
