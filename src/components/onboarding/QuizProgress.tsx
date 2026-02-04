import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QuizProgressProps {
    currentStep: number;
    totalSteps: number;
    className?: string;
}

const phases = [
    { id: 'A', label: 'About You', steps: [1, 2, 3, 4, 5, 6], color: 'from-blue-500 to-cyan-500' },
    { id: 'B', label: 'Your Style', steps: [7, 8, 9, 10, 11], color: 'from-purple-500 to-pink-500' },
    { id: 'C', label: 'Your Trip', steps: [12, 13, 14, 15, 16, 17], color: 'from-amber-500 to-orange-500' },
];

export function QuizProgress({ currentStep, totalSteps, className }: QuizProgressProps) {
    const progress = (currentStep / totalSteps) * 100;

    // Find current phase
    const currentPhase = phases.find(p => p.steps.includes(currentStep)) || phases[0];

    return (
        <div className={cn("w-full", className)}>
            {/* Phase Indicator */}
            <div className="flex items-center justify-between mb-1 sm:mb-4">
                {phases.map((phase, index) => {
                    const isActive = phase.id === currentPhase.id;
                    const isCompleted = phases.indexOf(currentPhase) > index;

                    return (
                        <div key={phase.id} className="flex items-center flex-1">
                            {/* Phase Circle */}
                            <div className="flex flex-col items-center">
                                <motion.div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                                        isCompleted
                                            ? `bg-gradient-to-r ${phase.color} text-white`
                                            : isActive
                                                ? `bg-gradient-to-r ${phase.color} text-white ring-4 ring-white/20`
                                                : "bg-white/10 text-white/40"
                                    )}
                                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                                    transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
                                >
                                    {isCompleted ? '✓' : phase.id}
                                </motion.div>
                                <span className={cn(
                                    "text-xs mt-2 font-medium transition-colors hidden md:block",
                                    isActive ? "text-white" : "text-white/40"
                                )}>
                                    {phase.label}
                                </span>
                            </div>

                            {/* Connector Line */}
                            {index < phases.length - 1 && (
                                <div className="flex-1 h-1 mx-3 bg-white/10 rounded-full overflow-hidden hidden md:block">
                                    <motion.div
                                        className={cn("h-full bg-gradient-to-r", phase.color)}
                                        initial={{ width: '0%' }}
                                        animate={{
                                            width: isCompleted ? '100%' : isActive
                                                ? `${((currentStep - phase.steps[0]) / (phase.steps.length - 1)) * 100}%`
                                                : '0%'
                                        }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Main Progress Bar */}
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-orange-500 to-red-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />

                {/* Shimmer Effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    style={{ width: '50%' }}
                />
            </div>

            {/* Step Counter */}
            <div className="flex justify-between items-center mt-1 sm:mt-3">
                <span className="text-xs text-white/50">
                    Step {currentStep} of {totalSteps}
                </span>
                <span className="text-xs font-medium text-primary">
                    {Math.round(progress)}% Complete
                </span>
            </div>
        </div>
    );
}

export default QuizProgress;
