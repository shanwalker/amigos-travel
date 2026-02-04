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

            <StaggeredContainer className="grid grid-cols-2 gap-2 sm:gap-4">
                {COMPANION_OPTIONS.map((option) => (
                    <StaggeredItem key={option.value}>
                        <motion.button
                            onClick={() => onChange(option.value)}
                            className={cn(
                                "w-full p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-left group h-full flex flex-col justify-between",
                                value === option.value
                                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                    : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                            )}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-center sm:text-left">
                                <span className="text-2xl sm:text-3xl">{option.emoji}</span>
                                <div className="flex-1">
                                    <h3 className={cn(
                                        "font-bold text-sm sm:text-lg mb-0.5 sm:mb-1 transition-colors leading-tight",
                                        value === option.value ? "text-primary" : "text-white"
                                    )}>
                                        {option.label}
                                    </h3>
                                    <p className="text-white/50 text-[10px] sm:text-sm leading-tight hidden sm:block">{option.description}</p>
                                </div>

                                {/* Selection Indicator - Hidden on mobile to save space, visible on selection or desktop */}
                                <div className={cn(
                                    "hidden sm:flex w-6 h-6 rounded-full border-2 items-center justify-center transition-all",
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
