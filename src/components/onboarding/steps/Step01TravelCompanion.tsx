import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TravelCompanion, COMPANION_OPTIONS } from '@/types/onboarding-quiz';
import { StepHeader, StaggeredContainer, StaggeredItem } from '../StepTransition';

interface Step01Props {
    value: TravelCompanion | null;
    onChange: (value: TravelCompanion) => void;
}

export function Step01TravelCompanion({ value, onChange }: Step01Props) {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <StepHeader
                title="Who are you travelling with?"
                subtitle="This helps us find the perfect trip for you"
                emoji="🌍"
            />

            <StaggeredContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COMPANION_OPTIONS.map((option) => (
                    <StaggeredItem key={option.value}>
                        <motion.button
                            onClick={() => onChange(option.value)}
                            className={cn(
                                "w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left group",
                                value === option.value
                                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                    : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                            )}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-start gap-4">
                                <span className="text-3xl">{option.emoji}</span>
                                <div className="flex-1">
                                    <h3 className={cn(
                                        "font-bold text-lg mb-1 transition-colors",
                                        value === option.value ? "text-primary" : "text-white"
                                    )}>
                                        {option.label}
                                    </h3>
                                    <p className="text-white/50 text-sm">{option.description}</p>
                                </div>

                                {/* Selection Indicator */}
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                    value === option.value
                                        ? "border-primary bg-primary"
                                        : "border-white/30"
                                )}>
                                    {value === option.value && (
                                        <motion.svg
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-4 h-4 text-navy-deep"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </motion.svg>
                                    )}
                                </div>
                            </div>
                        </motion.button>
                    </StaggeredItem>
                ))}
            </StaggeredContainer>
        </div>
    );
}

export default Step01TravelCompanion;
