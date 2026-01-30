import React from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./animations";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RegionOption {
    id: string;
    label: string;
    emoji: string;
}

interface StepRegionsProps {
    options: RegionOption[];
    selectedValues: string[];
    onToggle: (id: string) => void;
    onNext: () => void;
}

export const StepRegions = ({
    options,
    selectedValues,
    onToggle,
    onNext
}: StepRegionsProps) => {
    return (
        <div className="w-full h-full flex flex-col justify-center max-h-[85vh] py-2">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6 md:mb-8 space-y-1 flex-none"
            >
                {/* <span className="text-xs font-medium text-primary uppercase tracking-wider opacity-80">Geography</span> */}
                <h1 className="font-serif text-2xl md:text-4xl font-bold text-foreground">
                    Any specific region?
                </h1>
            </motion.div>

            {/* COMPACT PILL GRID (Similar to Interests to save space) */}
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
                                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-lg shadow-primary/10"
                                    : "border-border/30 bg-card/20 backdrop-blur-sm hover:border-primary/30 hover:bg-card/40"
                            )}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="text-3xl md:text-4xl mb-1.5 transition-transform duration-300 group-hover:scale-110">
                                {option.emoji}
                            </div>
                            <span className={cn(
                                "font-medium text-xs md:text-sm text-center leading-tight",
                                isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                                {option.label}
                            </span>

                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 right-2 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-primary flex items-center justify-center"
                                >
                                    <Check className="w-2 h-2 md:w-2.5 md:h-2.5 text-primary-foreground" strokeWidth={3} />
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
                    {selectedValues.length === 0 ? "Anywhere is fine" : "Continue"}
                </Button>
            </div>
        </div>
    );
};
