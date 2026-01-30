import React from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./animations";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonalityOption {
    id: string;
    title: string;
    description: string;
    emoji: string;
    color: string;
}

interface StepPersonalityProps {
    options: PersonalityOption[];
    selectedValue: string;
    onSelect: (id: string) => void;
}

export const StepPersonality = ({
    options,
    selectedValue,
    onSelect,
}: StepPersonalityProps) => {
    return (
        <div className="w-full h-full flex flex-col justify-center max-h-[85vh] py-2">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-4 md:mb-8 space-y-1 flex-none"
            >
                <span className="text-xs font-medium text-primary uppercase tracking-wider opacity-80">First things first</span>
                <h1 className="font-serif text-2xl md:text-4xl font-bold text-foreground">
                    What's your travel vibe?
                </h1>
            </motion.div>

            {/* ULTRA COMPACT GRID: Mobile 2x2 with reduced padding. Desktop 4x1. */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-5xl mx-auto flex-1 md:flex-none content-center"
            >
                {options.map((option) => {
                    const isSelected = selectedValue === option.id;

                    return (
                        <motion.button
                            key={option.id}
                            variants={itemVariants}
                            onClick={() => onSelect(option.id)}
                            className={cn(
                                "relative group flex flex-col items-center justify-center p-3 md:p-6 rounded-xl border transition-all duration-300 w-full aspect-[4/5] md:aspect-[3/4] max-h-[160px] md:max-h-[220px]",
                                "hover:shadow-[0_0_20px_-5px_var(--primary)]",
                                isSelected
                                    ? "border-primary bg-gradient-to-b from-primary/10 to-background ring-1 ring-primary shadow-lg shadow-primary/20"
                                    : "border-border/30 bg-card/20 backdrop-blur-sm hover:border-primary/50 hover:bg-card/40"
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            {/* Visual Icon with soft glow */}
                            <div className={cn(
                                "flex items-center justify-center w-10 h-10 md:w-16 md:h-16 rounded-full mb-2 md:mb-4 text-2xl md:text-4xl transition-transform duration-500",
                                "bg-gradient-to-br from-white/10 to-transparent border border-white/10",
                                isSelected ? "scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "group-hover:scale-110"
                            )}>
                                {option.emoji}
                            </div>

                            <div className="flex flex-col items-center text-center w-full relative z-10">
                                <h3 className={cn(
                                    "font-serif font-bold text-sm md:text-xl mb-0.5 transition-colors leading-tight",
                                    isSelected ? "text-primary" : "text-foreground"
                                )}>
                                    {option.title}
                                </h3>
                                {/* Hide description on very small screens to save space, show on larger */}
                                <p className="text-[10px] md:text-xs text-muted-foreground leading-tight px-1 opacity-80 md:opacity-100 line-clamp-2 md:line-clamp-none">
                                    {option.description}
                                </p>
                            </div>

                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 right-2 md:top-3 md:right-3 w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary flex items-center justify-center shadow-lg"
                                >
                                    <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary-foreground" strokeWidth={3} />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
};
