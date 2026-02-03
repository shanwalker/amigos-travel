import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizNavigationProps {
    currentStep: number;
    totalSteps: number;
    canGoNext: boolean;
    canGoPrev: boolean;
    isLoading?: boolean;
    onNext: () => void;
    onPrev: () => void;
    onSkip?: () => void;
    showSkip?: boolean;
    nextLabel?: string;
    className?: string;
}

export function QuizNavigation({
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrev,
    isLoading = false,
    onNext,
    onPrev,
    onSkip,
    showSkip = false,
    nextLabel,
    className,
}: QuizNavigationProps) {
    const isLastStep = currentStep === totalSteps;
    const buttonLabel = nextLabel || (isLastStep ? 'Complete Quiz' : 'Continue');

    return (
        <div className={cn("flex items-center justify-between gap-4", className)}>
            {/* Back Button */}
            <motion.button
                onClick={onPrev}
                disabled={!canGoPrev || isLoading}
                className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300",
                    canGoPrev && !isLoading
                        ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                        : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                )}
                whileHover={canGoPrev && !isLoading ? { x: -3 } : {}}
                whileTap={canGoPrev && !isLoading ? { scale: 0.95 } : {}}
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
            </motion.button>

            {/* Center - Skip Button (optional) */}
            {showSkip && onSkip && (
                <button
                    onClick={onSkip}
                    disabled={isLoading}
                    className="text-sm text-white/50 hover:text-white/80 transition-colors underline-offset-4 hover:underline"
                >
                    Skip this step
                </button>
            )}

            {/* Next Button */}
            <motion.button
                onClick={onNext}
                disabled={!canGoNext || isLoading}
                className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300",
                    canGoNext && !isLoading
                        ? "bg-gradient-to-r from-primary via-orange-500 to-red-500 text-navy-deep hover:shadow-lg hover:shadow-primary/30"
                        : "bg-white/10 text-white/30 cursor-not-allowed"
                )}
                whileHover={canGoNext && !isLoading ? { x: 3, scale: 1.02 } : {}}
                whileTap={canGoNext && !isLoading ? { scale: 0.95 } : {}}
                style={canGoNext && !isLoading ? { boxShadow: '0 0 20px rgba(255, 180, 0, 0.3)' } : {}}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                    </>
                ) : (
                    <>
                        <span>{buttonLabel}</span>
                        <ChevronRight className="w-4 h-4" />
                    </>
                )}
            </motion.button>
        </div>
    );
}

export default QuizNavigation;
