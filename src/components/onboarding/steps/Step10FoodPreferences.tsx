import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FoodPreference, FOOD_OPTIONS } from '@/types/onboarding-quiz';
import { StepHeader, StaggeredContainer, StaggeredItem } from '../StepTransition';

interface Step10Props {
    value: FoodPreference[];
    onChange: (value: FoodPreference[]) => void;
}

export function Step10FoodPreferences({ value, onChange }: Step10Props) {
    const togglePreference = (pref: FoodPreference) => {
        if (value.includes(pref)) {
            onChange(value.filter(p => p !== pref));
        } else {
            onChange([...value, pref]);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <StepHeader
                title="Tell us about your food preferences"
                subtitle="Select all that apply - Optional"
                emoji="🍽️"
            />

            <StaggeredContainer className="grid grid-cols-2 gap-2 sm:gap-3">
                {FOOD_OPTIONS.map((option) => {
                    const isSelected = value.includes(option.value);

                    return (
                        <StaggeredItem key={option.value}>
                            <motion.button
                                onClick={() => togglePreference(option.value)}
                                className={cn(
                                    "w-full p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all flex items-center gap-2 sm:gap-3 relative",
                                    isSelected
                                        ? "border-green-500 bg-green-500/10"
                                        : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="text-xl sm:text-2xl">{option.emoji}</span>
                                <span className={cn(
                                    "font-medium text-xs sm:text-sm transition-colors flex-1 text-left leading-tight",
                                    isSelected ? "text-green-400" : "text-white/80"
                                )}>
                                    {option.label}
                                </span>

                                {/* Checkbox */}
                                <div className={cn(
                                    "w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0",
                                    isSelected
                                        ? "border-green-500 bg-green-500"
                                        : "border-white/30"
                                )}>
                                    {isSelected && (
                                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                    )}
                                </div>
                            </motion.button>
                        </StaggeredItem>
                    );
                })}
            </StaggeredContainer>

            <p className="text-center text-white/40 text-xs mt-6">
                This helps us recommend suitable restaurants and experiences.
            </p>
        </div>
    );
}

export default Step10FoodPreferences;
