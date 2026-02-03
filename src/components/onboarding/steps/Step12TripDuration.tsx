import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TripDuration, DURATION_OPTIONS } from '@/types/onboarding-quiz';
import { StepHeader, StaggeredContainer, StaggeredItem } from '../StepTransition';

interface Step12Props {
    value: TripDuration | null;
    onChange: (value: TripDuration) => void;
}

const durationIcons = {
    '3-5': '🌅',
    '6-9': '🌴',
    '10-14': '🏝️',
    'flexible': '🎲',
};

export function Step12TripDuration({ value, onChange }: Step12Props) {
    return (
        <div className="w-full max-w-md mx-auto">
            <StepHeader
                title="How long do you want to travel?"
                subtitle="Your ideal trip duration"
                emoji="📅"
            />

            <StaggeredContainer className="space-y-3">
                {DURATION_OPTIONS.map((option) => {
                    const isSelected = value === option.value;

                    return (
                        <StaggeredItem key={option.value}>
                            <motion.button
                                onClick={() => onChange(option.value)}
                                className={cn(
                                    "w-full p-5 rounded-2xl border-2 transition-all duration-300 group",
                                    isSelected
                                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                        : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all",
                                        isSelected ? "bg-primary/20" : "bg-white/5"
                                    )}>
                                        {durationIcons[option.value]}
                                    </div>

                                    <div className="flex-1 text-left">
                                        <h3 className={cn(
                                            "font-bold text-xl mb-0.5 transition-colors",
                                            isSelected ? "text-primary" : "text-white"
                                        )}>
                                            {option.label}
                                        </h3>
                                        <p className="text-white/50 text-sm">{option.subtitle}</p>
                                    </div>

                                    {/* Selection Indicator */}
                                    <div className={cn(
                                        "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
                                        isSelected
                                            ? "border-primary bg-primary"
                                            : "border-white/30"
                                    )}>
                                        {isSelected && (
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
                    );
                })}
            </StaggeredContainer>
        </div>
    );
}

export default Step12TripDuration;
