import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlanningDatesType, DATES_TYPE_OPTIONS, SpecificDates } from '@/types/onboarding-quiz';
import { StepHeader, StaggeredContainer, StaggeredItem } from '../StepTransition';

interface Step14Props {
    dateType: PlanningDatesType | null;
    specificDates: SpecificDates;
    onDateTypeChange: (value: PlanningDatesType) => void;
    onSpecificDatesChange: (value: SpecificDates) => void;
}

export function Step14PlanningDates({
    dateType,
    specificDates,
    onDateTypeChange,
    onSpecificDatesChange
}: Step14Props) {
    return (
        <div className="w-full max-w-md mx-auto">
            <StepHeader
                title="When are you planning to travel?"
                subtitle="Fixed or flexible?"
                emoji="🗓️"
            />

            <StaggeredContainer className="space-y-2 sm:space-y-4">
                {DATES_TYPE_OPTIONS.map((option) => {
                    const isSelected = dateType === option.value;

                    return (
                        <StaggeredItem key={option.value}>
                            <motion.button
                                onClick={() => onDateTypeChange(option.value)}
                                className={cn(
                                    "w-full p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-left",
                                    isSelected
                                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                        : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className={cn(
                                        "w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all flex-shrink-0",
                                        isSelected ? "bg-primary/20" : "bg-white/5"
                                    )}>
                                        {option.value === 'fixed'
                                            ? <CalendarDays className={cn("w-5 h-5 sm:w-6 sm:h-6", isSelected ? "text-primary" : "text-white/60")} />
                                            : <Calendar className={cn("w-5 h-5 sm:w-6 sm:h-6", isSelected ? "text-primary" : "text-white/60")} />
                                        }
                                    </div>

                                    <div className="flex-1">
                                        <h3 className={cn(
                                            "font-bold text-base sm:text-lg mb-0.5 transition-colors",
                                            isSelected ? "text-primary" : "text-white"
                                        )}>
                                            {option.label}
                                        </h3>
                                        <p className="text-white/50 text-xs sm:text-sm">{option.description}</p>
                                    </div>

                                    {/* Selection Indicator */}
                                    <div className={cn(
                                        "w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
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

            {/* Date Picker for Fixed Dates */}
            <AnimatePresence>
                {dateType === 'fixed' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 space-y-4 overflow-hidden"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-white/60 text-sm mb-2 block">Start Date</label>
                                <input
                                    type="date"
                                    value={specificDates.start || ''}
                                    onChange={(e) => onSpecificDatesChange({ ...specificDates, start: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all [color-scheme:dark]"
                                />
                            </div>
                            <div>
                                <label className="text-white/60 text-sm mb-2 block">End Date</label>
                                <input
                                    type="date"
                                    value={specificDates.end || ''}
                                    onChange={(e) => onSpecificDatesChange({ ...specificDates, end: e.target.value })}
                                    min={specificDates.start || new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all [color-scheme:dark]"
                                />
                            </div>
                        </div>
                        <p className="text-white/40 text-xs text-center">
                            📌 These dates are approximate and can be adjusted later.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {dateType === 'flexible' && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-primary text-sm mt-6"
                >
                    ✨ Great! We'll suggest the best times to visit your destinations.
                </motion.p>
            )}
        </div>
    );
}

export default Step14PlanningDates;
