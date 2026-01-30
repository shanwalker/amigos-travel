import React from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./animations";
import { cn } from "@/lib/utils";

interface TravelStyleOption {
    id: string;
    label: string;
    emoji: string;
    description: string;
}

interface StepTravelStyleProps {
    options: TravelStyleOption[];
    selectedValue: string;
    onSelect: (id: string) => void;
}

export const StepTravelStyle = ({
    options,
    selectedValue,
    onSelect
}: StepTravelStyleProps) => {
    return (
        <div className="w-full h-full flex flex-col justify-center max-h-[85vh] py-2">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6 md:mb-8 space-y-1 flex-none"
            >
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] opacity-80">The Crew</span>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                    Who's coming?
                </h1>
            </motion.div>

            {/* ULTRA-COMPACT GRID: 5 items */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap justify-center gap-2 md:gap-3 w-full max-w-2xl mx-auto px-2"
            >
                {options.map((option) => {
                    const isSelected = selectedValue === option.id;

                    return (
                        <motion.button
                            key={option.id}
                            variants={itemVariants}
                            onClick={() => onSelect(option.id)}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-300",
                                "w-[calc(50%-0.5rem)] md:w-[calc(33.33%-0.5rem)]", // 2 col mobile, 3 col desktop
                                "h-24", // Fixed exceptionally small height
                                isSelected
                                    ? "border-primary bg-primary/10 ring-1 ring-primary shadow-lg"
                                    : "border-white/10 bg-white/5 backdrop-blur-md hover:border-primary/30 hover:bg-white/10"
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="text-2xl md:text-3xl mb-1.5 grayscale group-hover:grayscale-0 transition-all">
                                {option.emoji}
                            </div>
                            <h3 className={cn(
                                "font-bold text-xs md:text-sm leading-tight",
                                isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
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
