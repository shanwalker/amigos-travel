import React from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./animations";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AvoidOption {
    id: string;
    label: string;
    emoji: string;
}

interface StepAvoidProps {
    options: AvoidOption[];
    selectedValues: string[];
    onToggle: (id: string) => void;
    onNext: () => void;
}

export const StepAvoid = ({
    options,
    selectedValues,
    onToggle,
    onNext
}: StepAvoidProps) => {
    return (
        <div className="w-full h-full flex flex-col justify-center max-h-[85vh] py-2">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6 md:mb-8 space-y-1 flex-none"
            >
                <span className="text-xs font-medium text-red-400 uppercase tracking-wider opacity-80">Preferences</span>
                <h1 className="font-serif text-2xl md:text-4xl font-bold text-foreground">
                    Anything to Avoid?
                </h1>
            </motion.div>

            {/* COMPACT RED GRID */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 w-full max-w-4xl mx-auto px-1 content-center"
            >
                {options.map((option) => {
                    const isSelected = selectedValues.includes(option.id);

                    return (
                        <motion.button
                            key={option.id}
                            variants={itemVariants}
                            onClick={() => onToggle(option.id)}
                            className={cn(
                                "relative group flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 min-h-[90px] md:min-h-[110px]",
                                isSelected
                                    ? "border-red-400/50 bg-red-400/10 ring-1 ring-red-400/50 shadow-lg"
                                    : "border-border/30 bg-card/20 backdrop-blur-sm hover:border-red-400/30 hover:bg-card/40"
                            )}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="text-2xl md:text-3xl mb-1.5 grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100">
                                {option.emoji}
                            </div>
                            <span className={cn(
                                "font-medium text-xs md:text-sm text-center leading-tight",
                                isSelected ? "text-red-400" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                                {option.label}
                            </span>

                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center p-0.5"
                                >
                                    <span className="text-white font-bold leading-none text-[8px]">✕</span>
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </motion.div>

            {/* Footer Actions */}
            <div className="fixed md:static bottom-4 left-0 right-0 px-4 md:px-0 flex justify-center z-20 md:mt-6">
                <Button
                    onClick={onNext}
                    className={cn(
                        "rounded-full w-full md:w-auto px-10 py-5 text-base md:text-lg shadow-xl shadow-primary/20",
                    )}
                >
                    {selectedValues.length === 0 ? "Nothing to avoid" : "Continue"}
                </Button>
            </div>
        </div>
    );
};
