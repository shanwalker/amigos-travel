import React from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./animations";
import { cn } from "@/lib/utils";

interface BudgetOption {
    id: string;
    label: string;
    min: number;
    max: number;
    subtitle: string;
}

interface StepBudgetProps {
    options: BudgetOption[];
    selectedBudget: { min: number; max: number } | null;
    onSelect: (budget: { min: number; max: number }) => void;
}

export const StepBudget = ({
    options,
    selectedBudget,
    onSelect
}: StepBudgetProps) => {
    return (
        <div className="w-full h-full flex flex-col justify-center max-h-[85vh] py-2">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6 md:mb-8 space-y-1 flex-none"
            >
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] opacity-80">Investment</span>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                    What's the budget?
                </h1>
                <p className="text-muted-foreground text-[10px] md:text-xs uppercase tracking-wide opacity-60">Per Person (Excl. Flights)</p>
            </motion.div>

            {/* ULTRA-COMPACT 2x2 GRID */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-3 w-full max-w-2xl mx-auto px-4"
            >
                {options.map((option) => {
                    const isSelected = selectedBudget?.min === option.min;

                    return (
                        <motion.button
                            key={option.id}
                            variants={itemVariants}
                            onClick={() => onSelect({ min: option.min, max: option.max })}
                            className={cn(
                                "relative flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-all duration-300 w-full",
                                // Fixed height ensures it stays small
                                "h-24 md:h-28",
                                isSelected
                                    ? "border-primary bg-primary/10 ring-1 ring-primary shadow-lg shadow-primary/10"
                                    : "border-white/10 bg-white/5 backdrop-blur-md hover:border-primary/30 hover:bg-white/10"
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Decoration Circle */}
                            <div className={cn(
                                "absolute top-2 right-2 w-2 h-2 rounded-full",
                                isSelected ? "bg-primary animate-pulse" : "bg-white/10"
                            )} />

                            <div className={cn(
                                "text-lg md:text-xl font-bold mb-1 transition-colors font-serif",
                                isSelected ? "text-primary" : "text-foreground"
                            )}>
                                {option.label}
                            </div>

                            <div className="h-px w-8 bg-border/50 my-1" />

                            <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-tight">
                                {option.subtitle}
                            </p>
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
};
