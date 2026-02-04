import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface StepTransitionProps {
    children: ReactNode;
    stepKey: string | number;
    direction?: 'forward' | 'backward';
}

const variants = {
    enter: (direction: 'forward' | 'backward') => ({
        x: direction === 'forward' ? 100 : -100,
        opacity: 0,
        scale: 0.95,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: 'forward' | 'backward') => ({
        x: direction === 'forward' ? -100 : 100,
        opacity: 0,
        scale: 0.95,
    }),
};

export function StepTransition({
    children,
    stepKey,
    direction = 'forward'
}: StepTransitionProps) {
    return (
        <AnimatePresence mode="wait" custom={direction}>
            <motion.div
                key={stepKey}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                }}
                className="w-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Staggered children animation wrapper
interface StaggeredContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}

export function StaggeredContainer({
    children,
    className,
    staggerDelay = 0.1
}: StaggeredContainerProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Individual staggered item
interface StaggeredItemProps {
    children: ReactNode;
    className?: string;
}

export function StaggeredItem({ children, className }: StaggeredItemProps) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 24,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Step header with animated underline
interface StepHeaderProps {
    title: string;
    subtitle?: string;
    emoji?: string;
}

export function StepHeader({ title, subtitle, emoji }: StepHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-0 sm:mb-8"
        >
            {emoji && (
                <motion.span
                    className="text-2xl sm:text-4xl mb-0 sm:mb-4 block leading-tight"
                    animate={{
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {emoji}
                </motion.span>
            )}
            <h2 className="text-lg sm:text-3xl font-bold text-white mb-0 sm:mb-3 font-jakarta leading-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="text-white/60 text-[10px] sm:text-lg max-w-md mx-auto leading-tight mt-0.5 sm:mt-0">
                    {subtitle}
                </p>
            )}
            <motion.div
                className="w-16 h-1 mx-auto mt-2 sm:mt-4 bg-gradient-to-r from-primary to-orange-500 rounded-full hidden sm:block"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            />
        </motion.div>
    );
}

export default StepTransition;
