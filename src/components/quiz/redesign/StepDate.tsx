import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, itemVariants } from "./animations";
import { cn } from "@/lib/utils";
import { Calendar, ChevronRight, Check } from "lucide-react";

interface StepDateProps {
    dateType?: 'specific' | 'flexible' | 'month';
    preferredMonth?: string;
    onSelectType: (type: 'specific' | 'flexible' | 'month') => void;
    onSelectMonth: (month: string) => void;
}

const travelDateOptions = [
    { id: 'flexible', label: "I'm flexible", description: 'Next 3-6 months', emoji: '📅' },
    { id: 'month', label: 'Specific month', description: 'I have a month in mind', emoji: '🗓️' },
    { id: 'specific', label: 'Specific dates', description: 'I know exact dates', emoji: '📆' },
];

const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const StepDate = ({
    dateType,
    preferredMonth,
    onSelectType,
    onSelectMonth
}: StepDateProps) => {

    return (
        <div className="w-full h-full flex flex-col justify-center max-h-[85vh] py-2">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6 md:mb-10 space-y-1 flex-none"
            >
                <span className="text-xs font-medium text-primary uppercase tracking-wider opacity-80">Timing is everything</span>
                <h1 className="font-serif text-2xl md:text-4xl font-bold text-foreground">
                    When are you going?
                </h1>
            </motion.div>

            <AnimatePresence mode="wait">
                {/* VIEW 1: SELECT TYPE - Compact List */}
                {(!dateType || (dateType === 'month' && !preferredMonth)) && (
                    <motion.div
                        key="type-selection"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: -20 }}
                        className={cn(
                            "w-full max-w-xl mx-auto flex flex-col gap-2 md:gap-3",
                            dateType === 'month' ? "hidden" : "flex"
                        )}
                    >
                        {travelDateOptions.map((option) => (
                            <motion.button
                                key={option.id}
                                variants={itemVariants}
                                onClick={() => onSelectType(option.id as any)}
                                className="group flex items-center gap-3 p-3 md:p-5 rounded-xl border border-border/30 bg-card/20 backdrop-blur-sm hover:border-primary/40 hover:bg-card/40 transition-all text-left w-full hover:shadow-lg hover:shadow-primary/5"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="text-2xl md:text-3xl bg-background/30 p-2 rounded-lg text-shadow-sm">
                                    {option.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-serif font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors truncate">
                                        {option.label}
                                    </h3>
                                    <p className="text-muted-foreground text-xs md:text-sm truncate opacity-80">
                                        {option.description}
                                    </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {/* VIEW 2: MONTH PICKER (If 'month' selected) - Compact Grid */}
                {dateType === 'month' && (
                    <motion.div
                        key="month-selection"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-3xl mx-auto"
                    >
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                            {months.map((month) => (
                                <motion.button
                                    key={month}
                                    onClick={() => onSelectMonth(month)} // Note: Using short names now, map back to long if needed by backend, but usually UI consistency matters more
                                    className={cn(
                                        "flex flex-col items-center justify-center p-3 md:p-4 rounded-xl border transition-all aspect-square md:aspect-auto",
                                        preferredMonth?.startsWith(month) // Simple match
                                            ? "border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-inner"
                                            : "border-border/30 bg-card/20 hover:border-primary/30 hover:bg-card/40"
                                    )}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Calendar className={cn(
                                        "w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2",
                                        preferredMonth?.startsWith(month) ? "text-primary" : "text-muted-foreground/70"
                                    )} />
                                    <span className="font-medium text-xs md:text-sm">{month}</span>
                                </motion.button>
                            ))}
                        </div>
                        <button
                            onClick={() => onSelectType('flexible')}
                            className="mt-6 text-xs md:text-sm text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors w-full text-center"
                        >
                            Back to options
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
