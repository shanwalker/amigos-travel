import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DestinationKnowledge, DESTINATION_KNOWLEDGE_OPTIONS } from '@/types/onboarding-quiz';
import { StepHeader, StaggeredContainer, StaggeredItem } from '../StepTransition';

interface Step16Props {
    value: DestinationKnowledge | null;
    onChange: (value: DestinationKnowledge) => void;
}

export function Step16DestinationKnowledge({ value, onChange }: Step16Props) {
    return (
        <div className="w-full max-w-lg mx-auto">
            <StepHeader
                title="Do you want to know the destination?"
                subtitle="This is the exciting part!"
                emoji="🎁"
            />

            <StaggeredContainer className="space-y-2 sm:space-y-4">
                {DESTINATION_KNOWLEDGE_OPTIONS.map((option) => {
                    const isSelected = value === option.value;
                    const isSurprise = option.value === 'surprise';

                    return (
                        <StaggeredItem key={option.value}>
                            <motion.button
                                onClick={() => onChange(option.value)}
                                className={cn(
                                    "w-full p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-left group relative overflow-hidden",
                                    isSelected
                                        ? isSurprise
                                            ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                                            : "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                        : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                                )}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Sparkle effect for Surprise option */}
                                {isSurprise && isSelected && (
                                    <motion.div
                                        className="absolute inset-0 pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute w-1 h-1 bg-purple-400 rounded-full"
                                                style={{
                                                    left: `${20 + i * 15}%`,
                                                    top: `${30 + (i % 2) * 40}%`,
                                                }}
                                                animate={{
                                                    scale: [0, 1, 0],
                                                    opacity: [0, 1, 0],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    delay: i * 0.3,
                                                }}
                                            />
                                        ))}
                                    </motion.div>
                                )}

                                <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                                    <div className={cn(
                                        "w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl transition-all flex-shrink-0",
                                        isSelected
                                            ? isSurprise ? "bg-purple-500/20" : "bg-primary/20"
                                            : "bg-white/5 group-hover:bg-white/10"
                                    )}>
                                        {option.emoji}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className={cn(
                                            "font-bold text-base sm:text-lg mb-0.5 sm:mb-1 transition-colors flex items-center gap-1.5 sm:gap-2",
                                            isSelected
                                                ? isSurprise ? "text-purple-400" : "text-primary"
                                                : "text-white"
                                        )}>
                                            {option.label}
                                            {isSurprise && <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />}
                                        </h3>
                                        <p className="text-white/50 text-xs sm:text-sm leading-tight">{option.description}</p>
                                    </div>

                                    {/* Selection Indicator */}
                                    <div className={cn(
                                        "w-5 h-5 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                                        isSelected
                                            ? isSurprise
                                                ? "border-purple-500 bg-purple-500"
                                                : "border-primary bg-primary"
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

            {value === 'surprise' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"
                >
                    <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-purple-300 text-sm">
                        Exciting! Our experts will craft your perfect surprise trip.
                        You'll receive clues leading up to your departure! 🎯
                    </p>
                </motion.div>
            )}
        </div>
    );
}

export default Step16DestinationKnowledge;
