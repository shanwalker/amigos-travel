import { motion } from 'framer-motion';
import { Check, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HealthCondition, HEALTH_OPTIONS } from '@/types/onboarding-quiz';
import { StepHeader, StaggeredContainer, StaggeredItem } from '../StepTransition';

interface Step11Props {
    value: HealthCondition[];
    onChange: (value: HealthCondition[]) => void;
}

export function Step11HealthConditions({ value, onChange }: Step11Props) {
    const toggleCondition = (condition: HealthCondition) => {
        if (value.includes(condition)) {
            onChange(value.filter(c => c !== condition));
        } else {
            onChange([...value, condition]);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <StepHeader
                title="Any conditions we should know about?"
                subtitle="This helps us plan safer activities - Optional"
                emoji="🏥"
            />

            {/* Privacy Notice */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3"
            >
                <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-blue-300 text-sm">
                    This information is kept private and only used to ensure your activities are safe and comfortable.
                </p>
            </motion.div>

            <StaggeredContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HEALTH_OPTIONS.map((option) => {
                    const isSelected = value.includes(option.value);

                    return (
                        <StaggeredItem key={option.value}>
                            <motion.button
                                onClick={() => toggleCondition(option.value)}
                                className={cn(
                                    "w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-3",
                                    isSelected
                                        ? "border-amber-500 bg-amber-500/10"
                                        : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="text-2xl">{option.emoji}</span>
                                <span className={cn(
                                    "font-medium text-sm transition-colors flex-1 text-left",
                                    isSelected ? "text-amber-400" : "text-white/80"
                                )}>
                                    {option.label}
                                </span>

                                {/* Checkbox */}
                                <div className={cn(
                                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                                    isSelected
                                        ? "border-amber-500 bg-amber-500"
                                        : "border-white/30"
                                )}>
                                    {isSelected && (
                                        <Check className="w-3 h-3 text-navy-deep" />
                                    )}
                                </div>
                            </motion.button>
                        </StaggeredItem>
                    );
                })}
            </StaggeredContainer>

            <p className="text-center text-white/40 text-xs mt-6">
                This step is optional. Your privacy is important to us.
            </p>
        </div>
    );
}

export default Step11HealthConditions;
