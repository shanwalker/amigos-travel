import React from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./animations";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface InterestOption {
    id: string;
    label: string;
    emoji: string;
}

interface StepInterestsProps {
    options: InterestOption[];
    selectedValues: string[];
    onToggle: (id: string) => void;
    onNext: () => void;
}

export const StepInterests = ({
    options,
    selectedValues,
    onToggle,
    onNext
}: StepInterestsProps) => {
    return (
        <div className="w-full h-full flex flex-col justify-center max-h-[85vh] py-2">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6 md:mb-10 space-y-1 flex-none"
            >
                <span className="text-xs font-medium text-primary uppercase tracking-wider opacity-80">Curate your experience</span>
                <h1 className="font-serif text-2xl md:text-4xl font-bold text-foreground">
                    What excites you?
                </h1>
            </motion.div>

            {/* Pill Layout - Extremely Space Efficient */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap justify-center gap-2 md:gap-3 w-full max-w-3xl mx-auto content-center px-2"
            >
                {options.map((option) => {
                    const isSelected = selectedValues.includes(option.id);

                    return (
                        <motion.button
                            key={option.id}
                            variants={itemVariants}
                            onClick={() => onToggle(option.id)}
                            className={cn(
                                "relative flex items-center gap-2 pl-3 pr-4 py-2 md:pl-4 md:pr-6 md:py-3 rounded-full border transition-all duration-300",
                                isSelected
                                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-[0_0_15px_-5px_var(--primary)]"
                                    : "border-border/30 bg-card/30 backdrop-blur-sm text-muted-foreground hover:border-primary/30 hover:bg-card/50 hover:text-foreground"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-lg md:text-2xl">{option.emoji}</span>
                            <span className="font-medium text-xs md:text-base whitespace-nowrap">
                                {option.label}
                            </span>

                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="ml-1"
                                >
                                    <Check className="w-3 h-3 md:w-4 md:h-4 text-primary" strokeWidth={3} />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </motion.div>

            {/* Floating Compact Action Button */}
            <div className="fixed md:static bottom-4 left-0 right-0 px-4 md:px-0 flex justify-center z-20 md:mt-8">
                <Button
                    onClick={onNext}
                    disabled={selectedValues.length === 0}
                    className={cn(
                        "rounded-full w-full md:w-auto px-8 py-5 text-sm md:text-lg font-semibold shadow-lg shadow-primary/25",
                        "bg-gradient-to-r from-primary to-primary/80 hover:brightness-110 transition-all",
                        selectedValues.length > 0 ? "animate-in fade-in slide-in-from-bottom-2" : "opacity-50"
                    )}
                >
                    Continue ({selectedValues.length})
                </Button>
            </div>
        </div>
    );
};
