import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HardNoActivity, HARD_NO_OPTIONS } from '@/types/onboarding-quiz';
import { StepHeader, StaggeredContainer, StaggeredItem } from '../StepTransition';

interface Step09Props {
    value: HardNoActivity[];
    onChange: (value: HardNoActivity[]) => void;
}

export function Step09HardNoActivities({ value, onChange }: Step09Props) {
    const toggleActivity = (activity: HardNoActivity) => {
        if (value.includes(activity)) {
            onChange(value.filter(a => a !== activity));
        } else {
            onChange([...value, activity]);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <StepHeader
                title="Anything you'd like us to avoid?"
                subtitle="The 'Hard No' filter - Optional"
                emoji="⛔"
            />

            <StaggeredContainer className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {HARD_NO_OPTIONS.map((option) => {
                    const isSelected = value.includes(option.value);

                    return (
                        <StaggeredItem key={option.value}>
                            <motion.button
                                onClick={() => toggleActivity(option.value)}
                                className={cn(
                                    "w-full p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 sm:gap-2 relative h-full justify-center",
                                    isSelected
                                        ? "border-red-500 bg-red-500/10"
                                        : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                                )}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-2xl sm:text-3xl">{option.emoji}</span>
                                <span className={cn(
                                    "font-medium text-[10px] sm:text-sm text-center transition-colors leading-tight",
                                    isSelected ? "text-red-400" : "text-white/80"
                                )}>
                                    {option.label}
                                </span>

                                {/* Selection Badge */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center"
                                    >
                                        <span className="text-white text-[8px] sm:text-xs font-bold">✕</span>
                                    </motion.div>
                                )}
                            </motion.button>
                        </StaggeredItem>
                    );
                })}
            </StaggeredContainer>

            {value.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-6"
                >
                    <span className="text-red-400 text-sm">
                        {value.length} activit{value.length === 1 ? 'y' : 'ies'} will be avoided
                    </span>
                </motion.div>
            )}

            <p className="text-center text-white/40 text-xs mt-4">
                This step is optional. Continue to skip.
            </p>
        </div>
    );
}

export default Step09HardNoActivities;
