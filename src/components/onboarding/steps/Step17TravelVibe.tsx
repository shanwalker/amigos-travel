import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TravelVibe, VIBE_OPTIONS } from '@/types/onboarding-quiz';
import { StepHeader, StaggeredContainer, StaggeredItem } from '../StepTransition';

interface Step17Props {
    value: TravelVibe | null;
    onChange: (value: TravelVibe) => void;
}

export function Step17TravelVibe({ value, onChange }: Step17Props) {
    return (
        <div className="w-full max-w-3xl mx-auto">
            <StepHeader
                title="What's your travel vibe?"
                subtitle="Pick the one that speaks to your soul"
                emoji="✨"
            />

            <StaggeredContainer className="grid grid-cols-3 gap-2 sm:gap-4">
                {VIBE_OPTIONS.map((option) => {
                    const isSelected = value === option.value;

                    return (
                        <StaggeredItem key={option.value}>
                            <motion.button
                                onClick={() => onChange(option.value)}
                                className={cn(
                                    "w-full h-auto aspect-[3/4] sm:aspect-square rounded-xl sm:rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group flex flex-col items-center justify-center p-1 sm:p-4 text-center",
                                    isSelected
                                        ? "border-primary shadow-xl"
                                        : "border-white/10 hover:border-white/30"
                                )}
                                whileHover={{ scale: 1.03, y: -5 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {/* Gradient Background */}
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-br transition-opacity",
                                    option.color,
                                    isSelected ? "opacity-30" : "opacity-10 group-hover:opacity-20"
                                )} />

                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center justify-center">
                                    <motion.span
                                        className="text-2xl sm:text-5xl mb-1 sm:mb-3"
                                        animate={isSelected ? {
                                            rotate: [0, -10, 10, -10, 0],
                                            scale: [1, 1.2, 1],
                                        } : {}}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {option.emoji}
                                    </motion.span>
                                    <h3 className={cn(
                                        "font-bold text-xs sm:text-lg mb-0 transition-colors leading-tight",
                                        isSelected ? "text-primary" : "text-white"
                                    )}>
                                        {option.label}
                                    </h3>
                                    <p className="text-white/50 text-[10px] sm:text-xs leading-tight hidden sm:block">
                                        {option.description}
                                    </p>
                                </div>

                                {/* Selection Border Glow */}
                                {isSelected && (
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        style={{
                                            boxShadow: 'inset 0 0 30px rgba(255, 180, 0, 0.3), 0 0 40px rgba(255, 180, 0, 0.2)',
                                        }}
                                    />
                                )}

                                {/* Check Mark */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 w-5 h-5 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center shadow-lg p-0.5 sm:p-0"
                                    >
                                        <svg
                                            className="w-full h-full text-navy-deep"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                )}
                            </motion.button>
                        </StaggeredItem>
                    );
                })}
            </StaggeredContainer>

            {value && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-8"
                >
                    <p className="text-white/60 text-sm">
                        Perfect! You're a <span className="text-primary font-bold">{VIBE_OPTIONS.find(v => v.value === value)?.label}</span>.
                        We'll tailor your experience accordingly!
                    </p>
                </motion.div>
            )}
        </div>
    );
}

export default Step17TravelVibe;
