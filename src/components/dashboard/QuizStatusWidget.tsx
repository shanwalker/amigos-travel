import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Gift,
    Clock,
    Sparkles,
    ChevronRight,
    Eye,
    ClipboardCheck,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useOnboardingQuiz, useLinkedSurpriseRequest, useHasCompletedQuiz } from '@/hooks/useOnboardingQuiz';
import { VIBE_OPTIONS } from '@/types/onboarding-quiz';
import { SurpriseTripReveal } from './SurpriseTripReveal';

export function QuizStatusWidget() {
    const { data: quiz, isLoading: quizLoading } = useOnboardingQuiz();
    const { data: hasCompleted } = useHasCompletedQuiz();
    const { data: surpriseRequest, isLoading: requestLoading } = useLinkedSurpriseRequest();
    const [showReveal, setShowReveal] = useState(false);

    const isLoading = quizLoading || requestLoading;
    const vibeDetails = quiz?.travel_vibe ? VIBE_OPTIONS.find(v => v.value === quiz.travel_vibe) : null;
    const wantsSurprise = quiz?.destination_knowledge === 'surprise';

    // If user hasn't completed the quiz, show CTA
    if (!hasCompleted && !isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="bg-gradient-to-br from-primary/10 via-orange-500/5 to-transparent border-primary/20 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-primary/20">
                                <ClipboardCheck className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-foreground mb-1">
                                    Complete Your Travel Profile
                                </h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    Take our quick quiz to get personalized trip recommendations tailored just for you!
                                </p>
                                <Link to="/start-quiz">
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Start Quiz
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    // If loading, show skeleton
    if (isLoading) {
        return (
            <Card className="bg-card/50 border-border/50 animate-pulse">
                <CardContent className="p-6">
                    <div className="h-20 bg-white/5 rounded-xl"></div>
                </CardContent>
            </Card>
        );
    }

    // If user completed quiz but no surprise request, show their vibe
    if (!wantsSurprise || !surpriseRequest) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Your Travel Profile
                        </CardTitle>
                        <CardDescription>Based on your quiz responses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {vibeDetails && (
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
                                <span className="text-4xl">{vibeDetails.emoji}</span>
                                <div>
                                    <p className="text-sm text-muted-foreground">Your Travel Vibe</p>
                                    <p className="font-bold text-primary text-lg">{vibeDetails.label}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{vibeDetails.description}</p>
                                </div>
                            </div>
                        )}
                        <Link to="/dashboard/requests" className="block mt-4">
                            <Button variant="outline" className="w-full border-primary/30 text-primary">
                                View My Requests
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    // Surprise trip status widget
    const statusConfig = {
        pending: {
            icon: Clock,
            label: 'Submitted',
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
            message: "Our travel experts are reviewing your preferences...",
        },
        planning: {
            icon: Sparkles,
            label: 'Planning',
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/20',
            message: "Your surprise trip is being crafted!",
        },
        clues_sent: {
            icon: Gift,
            label: 'Clues Sent',
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20',
            message: "Check your inbox for exciting clues about your destination!",
        },
        ready: {
            icon: Gift,
            label: 'Ready to Reveal!',
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/20',
            message: "Your surprise trip is ready! Click below to reveal your destination.",
        },
        revealed: {
            icon: Eye,
            label: 'Revealed',
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            borderColor: 'border-primary/20',
            message: "Your destination has been revealed! Check your full itinerary.",
        },
        completed: {
            icon: Sparkles,
            label: 'Completed',
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20',
            message: "Hope you had an amazing trip!",
        },
    };

    const status = surpriseRequest.status;
    const config = statusConfig[status] || statusConfig.pending;
    const StatusIcon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Card className={`${config.bgColor} ${config.borderColor} border overflow-hidden`}>
                <CardContent className="p-6">
                    {/* Status Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${config.bgColor}`}>
                                <Gift className="h-6 w-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-foreground">Surprise Trip</h3>
                                <Badge className={`${config.bgColor} ${config.color} border-none`}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {config.label}
                                </Badge>
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
                    <p className="text-muted-foreground text-sm mb-4">
                        {config.message}
                    </p>

                    {/* Action Button */}
                    {status === 'ready' && (
                        <Button
                            onClick={() => setShowReveal(true)}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                        >
                            <Gift className="mr-2 h-4 w-4" />
                            Reveal My Destination
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}

                    {status === 'revealed' && (
                        <Link to="/dashboard/surprise-suggestions" className="block">
                            <Button variant="outline" className="w-full border-primary/30 text-primary">
                                <Eye className="mr-2 h-4 w-4" />
                                View Full Itinerary
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    )}

                    {(status === 'pending' || status === 'planning' || status === 'clues_sent') && (
                        <div className="text-center">
                            <p className="text-muted-foreground text-xs">
                                We'll notify you when there's an update!
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Reveal Modal */}
            <Dialog open={showReveal} onOpenChange={setShowReveal}>
                <DialogContent className="bg-[hsl(220,20%,10%)] border-white/10 max-w-lg p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-foreground text-center">
                            🎉 Your Surprise Awaits!
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-6">
                        <SurpriseTripReveal
                            destination={{
                                name: surpriseRequest.suggested_destination || 'Mystery Destination',
                                country: '',
                                description: surpriseRequest.admin_notes,
                            }}
                            onComplete={() => {
                                setShowReveal(false);
                                // Refetch the request status
                                window.location.reload();
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}

export default QuizStatusWidget;
