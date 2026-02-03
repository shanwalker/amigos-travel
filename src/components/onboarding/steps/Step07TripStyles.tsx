import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TripStyle, TRIP_STYLE_OPTIONS } from '@/types/onboarding-quiz';
import { StepHeader, StaggeredContainer, StaggeredItem } from '../StepTransition';

interface Step07Props {
    value: TripStyle[];
    onChange: (value: TripStyle[]) => void;
    maxSelections?: number;
}

export function Step07TripStyles({
    value,
    onChange,
    maxSelections = 3
}: Step07Props) {
    const toggleStyle = (style: TripStyle) => {
        if (value.includes(style)) {
            onChange(value.filter(s => s !== style));
        } else if (value.length < maxSelections) {
            onChange([...value, style]);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <StepHeader
                title="What kind of trip do you enjoy most?"
                subtitle={`Select up to ${maxSelections} (${value.length}/${maxSelections} selected)`}
                emoji="🎯"
            />

            <StaggeredContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TRIP_STYLE_OPTIONS.map((option) => {
                    const isSelected = value.includes(option.value);
                    const isDisabled = !isSelected && value.length >= maxSelections;

                    return (
                        <StaggeredItem key={option.value}>
                            <motion.button
                                onClick={() => !isDisabled && toggleStyle(option.value)}
                                disabled={isDisabled}
                                className={cn(
                                    "w-full p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 relative",
                                    isSelected
                                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                        : isDisabled
                                            ? "border-white/5 bg-white/5 opacity-50 cursor-not-allowed"
                                            : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                                )}
                                whileHover={!isDisabled ? { scale: 1.05, y: -3 } : {}}
                                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                            >
                                <span className="text-3xl">{option.emoji}</span>
                                <span className={cn(
                                    "font-medium text-sm transition-colors",
                                    isSelected ? "text-primary" : "text-white/80"
                                )}>
                                    {option.label}
                                </span>

                                {/* Selection Badge */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                                    >
                                        <Check className="w-4 h-4 text-navy-deep" />
                                    </motion.div>
                                )}
                            </motion.button>
                        </StaggeredItem>
                    );
                })}
            </StaggeredContainer>

            {value.length === maxSelections && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-primary text-sm mt-6"
                >
                    ✓ Maximum selections reached. Deselect one to choose another.
                </motion.p>
            )}
        </div>
    );
}

export default Step07TripStyles;
