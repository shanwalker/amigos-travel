import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuizLayoutProps {
    children: ReactNode;
    currentStep: number;
    totalSteps: number;
    onBack?: () => void;
}

export const QuizLayout = ({
    children,
    currentStep,
    totalSteps,
    onBack,
}: QuizLayoutProps) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="fixed inset-0 w-full h-[100dvh] overflow-hidden bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
            {/* Animated Ambient Background - Optimized using CSS only for movement to reduce JS load */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-500/10 blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[100px] animate-pulse-slow delay-1000" />
            </div>

            {/* Grid Pattern Overlay (Optional for texture) */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none" />

            {/* Navbar - Fixed Top - Compact Premium (Reduced Height) */}
            <div className="relative z-50 flex-none bg-background/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-lg md:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            TravelAmigo
                        </span>
                    </div>
                    {/* Minimal Progress Indicator */}
                    <div className="flex items-center gap-3">
                        <div className="w-20 md:w-32 h-1.5 bg-secondary/50 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                                className="h-full bg-primary rounded-full relative"
                            >
                                <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Fully Centered & Compact */}
            <main className="relative z-10 flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 py-2 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="flex-1 flex flex-col justify-center items-center w-full h-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer / Back Button - Minimalist */}
            {onBack && currentStep > 1 && (
                <button
                    onClick={onBack}
                    className="absolute bottom-4 left-4 z-20 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 opacity-70 hover:opacity-100"
                >
                    ← Back
                </button>
            )}
        </div>
    );
};
