import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Gift,
    Clock,
    Sparkles,
    MapPin,
    CalendarDays,
    ChevronRight,
    Eye,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TravelVibe, VIBE_OPTIONS } from '@/types/onboarding-quiz';

interface SurpriseTripPendingCardProps {
    requestId: string;
    status: 'pending' | 'planning' | 'ready' | 'revealed';
    vibeType?: TravelVibe;
    submittedAt?: string;
    cluesReceived?: number;
    totalClues?: number;
    estimatedRevealDate?: string;
    onReveal?: () => void;
    className?: string;
}

const statusConfig = {
    pending: {
        label: 'Submitted',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        icon: Clock,
        message: "We've received your preferences. Our experts will start planning soon!",
    },
    planning: {
        label: 'Planning in Progress',
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20',
        icon: Sparkles,
        message: "Our travel experts are crafting your perfect surprise trip!",
    },
    ready: {
        label: 'Ready to Reveal!',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        icon: Gift,
        message: "Your surprise trip is ready! Click below to reveal your destination.",
    },
    revealed: {
        label: 'Revealed',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
        icon: MapPin,
        message: "Your trip has been revealed! Check your full itinerary below.",
    },
};

export function SurpriseTripPendingCard({
    requestId,
    status,
    vibeType,
    submittedAt,
    cluesReceived = 0,
    totalClues = 5,
    estimatedRevealDate,
    onReveal,
    className,
}: SurpriseTripPendingCardProps) {
    const config = statusConfig[status];
    const vibeDetails = vibeType ? VIBE_OPTIONS.find(v => v.value === vibeType) : null;
    const StatusIcon = config.icon;

    // Animated dots for "planning" state
    const [dots, setDots] = useState('');
    useEffect(() => {
        if (status === 'planning') {
            const interval = setInterval(() => {
                setDots(prev => prev.length >= 3 ? '' : prev + '.');
            }, 500);
            return () => clearInterval(interval);
        }
    }, [status]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "relative overflow-hidden rounded-2xl border",
                config.borderColor,
                config.bgColor,
                className
            )}
        >
            {/* Animated Background for "ready" state */}
            {status === 'ready' && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/5 via-orange-500/5 to-primary/5"
                    animate={{
                        x: ['0%', '100%', '0%'],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            )}

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            config.bgColor
                        )}>
                            <StatusIcon className={cn("w-6 h-6", config.color)} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Surprise Trip</h3>
                            <span className={cn("text-sm font-medium", config.color)}>
                                {config.label}{status === 'planning' ? dots : ''}
                            </span>
                        </div>
                    </div>

                    {vibeDetails && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full">
                            <span className="text-lg">{vibeDetails.emoji}</span>
                            <span className="text-white/60 text-sm">{vibeDetails.label}</span>
                        </div>
                    )}
                </div>

                {/* Status Message */}
                <p className="text-white/60 text-sm mb-4">
                    {config.message}
                </p>

                {/* Progress / Clues */}
                {(status === 'planning' || status === 'pending') && totalClues > 0 && (
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white/50 text-xs">Journey Clues</span>
                            <span className="text-white/70 text-xs">{cluesReceived} of {totalClues}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(cluesReceived / totalClues) * 100}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                )}

                {/* Dates Row */}
                <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
                    {submittedAt && (
                        <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-4 h-4" />
                            <span>Submitted: {new Date(submittedAt).toLocaleDateString()}</span>
                        </div>
                    )}
                    {estimatedRevealDate && status !== 'revealed' && (
                        <div className="flex items-center gap-1.5">
                            <Gift className="w-4 h-4" />
                            <span>Reveal: {new Date(estimatedRevealDate).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                {status === 'ready' && onReveal && (
                    <motion.button
                        onClick={onReveal}
                        className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-primary via-orange-500 to-red-500 text-navy-deep flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Gift className="w-5 h-5" />
                        <span>Reveal My Destination</span>
                    </motion.button>
                )}

                {status === 'revealed' && (
                    <Link
                        to={`/dashboard/surprise-suggestions?id=${requestId}`}
                        className="w-full py-4 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 transition-colors"
                    >
                        <Eye className="w-5 h-5" />
                        <span>View Full Itinerary</span>
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                )}

                {(status === 'pending' || status === 'planning') && (
                    <div className="text-center">
                        <p className="text-white/40 text-xs">
                            {status === 'pending'
                                ? 'You will receive clues as we plan your trip!'
                                : 'Keep an eye on your inbox for the next clue!'}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default SurpriseTripPendingCard;
