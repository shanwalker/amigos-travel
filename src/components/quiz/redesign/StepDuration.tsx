import React from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./animations";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface DurationOption {
    id: string;
    label: string;
    subtitle: string;
}

interface StepDurationProps {
    options: DurationOption[];
    selectedValue: string;
    onSelect: (id: string) => void;
}

export const StepDuration = ({
    options,
    selectedValue,
    onSelect
}: StepDurationProps) => {
    return (
        <div className="w-full h-full flex flex-col justify-center max-h-[85vh] py-2">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6 md:mb-8 space-y-1 flex-none"
            >
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] opacity-80">Timeline</span>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                    Trip Duration
                </h1>
            </motion.div>

            {/* ULTRA-COMPACT 2x2 GRID */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-3 w-full max-w-2xl mx-auto px-4"
            >
                {options.map((option) => {
                    const isSelected = selectedValue === option.id;

                    return (
                        <motion.button
                            key={option.id}
                            variants={itemVariants}
                            onClick={() => onSelect(option.id)}
                            className={cn(
                                "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 w-full",
                                "h-24 md:h-28", // Fixed small height
                                isSelected
                                    ? "border-primary bg-primary/10 ring-1 ring-primary shadow-lg shadow-primary/10"
                                    : "border-white/10 bg-white/5 backdrop-blur-md hover:border-primary/30 hover:bg-white/10"
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className={cn(
                                "mb-2 p-1.5 rounded-full transition-colors",
                                isSelected ? "bg-primary/20 text-primary" : "bg-white/10 text-muted-foreground"
                            )}>
                                <Clock className="w-4 h-4" />
                            </div>

                            <h3 className={cn(
                                "font-serif font-bold text-base md:text-lg mb-0.5",
                                isSelected ? "text-primary" : "text-foreground"
                            )}>
                                {option.label}
                            </h3>
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
};
