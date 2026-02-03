import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PassportNationality, PASSPORT_OPTIONS } from '@/types/onboarding-quiz';
import { StepHeader, StaggeredContainer, StaggeredItem } from '../StepTransition';

interface Step03Props {
    value: PassportNationality | null;
    onChange: (value: PassportNationality) => void;
}

export function Step03Passport({ value, onChange }: Step03Props) {
    return (
        <div className="w-full max-w-md mx-auto">
            <StepHeader
                title="Which passport do you travel with?"
                subtitle="This helps us plan visa requirements"
                emoji="🛂"
            />

            <StaggeredContainer className="space-y-4">
                {PASSPORT_OPTIONS.map((option) => (
                    <StaggeredItem key={option.value}>
                        <motion.button
                            onClick={() => onChange(option.value)}
                            className={cn(
                                "w-full p-6 rounded-2xl border-2 transition-all duration-300 flex items-center gap-5 group",
                                value === option.value
                                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                    : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-5xl">{option.emoji}</span>
                            <div className="flex-1 text-left">
                                <h3 className={cn(
                                    "font-bold text-xl transition-colors",
                                    value === option.value ? "text-primary" : "text-white"
                                )}>
                                    {option.label}
                                </h3>
                            </div>

                            {/* Selection Indicator */}
                            <div className={cn(
                                "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
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
                        </motion.button>
                    </StaggeredItem>
                ))}
            </StaggeredContainer>

            <p className="text-center text-white/40 text-xs mt-6">
                We use this to check visa requirements and suggest suitable destinations.
            </p>
        </div>
    );
}

export default Step03Passport;
