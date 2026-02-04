import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AmigoRole, AMIGO_ROLE_OPTIONS } from '@/types/onboarding-quiz';
import { StepHeader, StaggeredContainer, StaggeredItem } from '../StepTransition';

interface Step15Props {
    value: AmigoRole | null;
    onChange: (value: AmigoRole) => void;
}

export function Step15AmigoRole({ value, onChange }: Step15Props) {
    return (
        <div className="w-full max-w-lg mx-auto">
            <StepHeader
                title="How can Travel Amigo help you?"
                subtitle="Choose your preferred experience"
                emoji="🤝"
            />

            <StaggeredContainer className="space-y-2 sm:space-y-4">
                {AMIGO_ROLE_OPTIONS.map((option) => {
                    const isSelected = value === option.value;

                    return (
                        <StaggeredItem key={option.value}>
                            <motion.button
                                onClick={() => onChange(option.value)}
                                className={cn(
                                    "w-full p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-left group",
                                    isSelected
                                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                        : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                                )}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className={cn(
                                        "w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl transition-all flex-shrink-0",
                                        isSelected ? "bg-primary/20" : "bg-white/5 group-hover:bg-white/10"
                                    )}>
                                        {option.emoji}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className={cn(
                                            "font-bold text-base sm:text-lg mb-0.5 sm:mb-1 transition-colors",
                                            isSelected ? "text-primary" : "text-white"
                                        )}>
                                            {option.label}
                                        </h3>
                                        <p className="text-white/50 text-xs sm:text-sm leading-tight">{option.description}</p>
                                    </div>

                                    {/* Selection Indicator */}
                                    <div className={cn(
                                        "w-5 h-5 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                                        isSelected
                                            ? "border-primary bg-primary"
                                            : "border-white/30"
                                    )}>
                                        {isSelected && (
                                            <motion.svg
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-3 h-3 sm:w-4 sm:h-4 text-navy-deep"
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

export default Step15AmigoRole;
