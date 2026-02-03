import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BudgetRange, BUDGET_OPTIONS } from '@/types/onboarding-quiz';
import { StepHeader, StaggeredContainer, StaggeredItem } from '../StepTransition';

interface Step13Props {
    value: BudgetRange | null;
    onChange: (value: BudgetRange) => void;
}

const budgetColors = {
    'budget': 'from-green-400 to-emerald-500',
    'mid-range': 'from-blue-400 to-cyan-500',
    'luxury': 'from-purple-400 to-pink-500',
    'flexible': 'from-amber-400 to-orange-500',
};

export function Step13BudgetRange({ value, onChange }: Step13Props) {
    return (
        <div className="w-full max-w-lg mx-auto">
            <StepHeader
                title="What's your budget range?"
                subtitle="Per person estimate"
                emoji="💰"
            />

            <StaggeredContainer className="grid grid-cols-2 gap-4">
                {BUDGET_OPTIONS.map((option) => {
                    const isSelected = value === option.value;

                    return (
                        <StaggeredItem key={option.value}>
                            <motion.button
                                onClick={() => onChange(option.value)}
                                className={cn(
                                    "w-full p-5 rounded-2xl border-2 transition-all duration-300 text-center relative overflow-hidden group",
                                    isSelected
                                        ? "border-primary shadow-lg shadow-primary/20"
                                        : "border-white/10 hover:border-white/30"
                                )}
                                whileHover={{ scale: 1.03, y: -3 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {/* Background Gradient */}
                                <div className={cn(
                                    "absolute inset-0 opacity-0 transition-opacity",
                                    isSelected ? "opacity-20" : "group-hover:opacity-10"
                                )}>
                                    <div className={cn("w-full h-full bg-gradient-to-br", budgetColors[option.value])} />
                                </div>

                                <div className="relative z-10">
                                    <span className="text-4xl mb-3 block">{option.emoji}</span>
                                    <h3 className={cn(
                                        "font-bold text-lg mb-1 transition-colors",
                                        isSelected ? "text-primary" : "text-white"
                                    )}>
                                        {option.label}
                                    </h3>
                                    <p className="text-white/50 text-sm">{option.description}</p>
                                </div>

                                {/* Selection Indicator */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                                    >
                                        <motion.svg
                                            className="w-4 h-4 text-navy-deep"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </motion.svg>
                                    </motion.div>
                                )}
                            </motion.button>
                        </StaggeredItem>
                    );
                })}
            </StaggeredContainer>

            <p className="text-center text-white/40 text-xs mt-6">
                This is just an estimate to help us recommend suitable options.
            </p>
        </div>
    );
}

export default Step13BudgetRange;
