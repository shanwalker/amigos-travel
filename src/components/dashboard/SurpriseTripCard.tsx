import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, Users, DollarSign, Clock, Gift, MapPin } from 'lucide-react';
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import type { SurpriseRequestWithUser } from '@/lib/supabase/surprise-requests';

interface SurpriseTripCardProps {
    request: SurpriseRequestWithUser;
    onViewDetails?: (id: string) => void;
}

export function SurpriseTripCard({ request, onViewDetails }: SurpriseTripCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'revealed':
                return 'bg-green-500/10 text-green-500 border-green-500/30';
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
            case 'planning':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
            case 'clues_sent':
                return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
            case 'completed':
                return 'bg-green-500/10 text-green-500 border-green-500/30';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
        }
    };

    const cluesSent = request.clue_schedule?.filter(c => c.sent_at).length || 0;
    const totalClues = request.clue_schedule?.length || 5;
    const clueProgress = (cluesSent / totalClues) * 100;

    const daysUntilReveal = request.reveal_date
        ? differenceInDays(new Date(request.reveal_date), new Date())
        : null;

    const showCountdown = daysUntilReveal !== null && daysUntilReveal > 0 && request.status !== 'revealed';

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                            <Sparkles className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-1 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Surprise Trip Adventure
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Ref: {request.request_reference}
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(request.status)}>
                        {request.status}
                    </Badge>
                </div>

                {/* Countdown to Reveal */}
                {showCountdown && (
                    <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Gift className="h-5 w-5 text-purple-500" />
                            <span className="font-semibold text-purple-500">
                                {daysUntilReveal} {daysUntilReveal === 1 ? 'day' : 'days'} until reveal!
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Your surprise destination will be revealed on {request.reveal_date && format(new Date(request.reveal_date), 'MMMM dd, yyyy')}
                        </p>
                    </div>
                )}

                {/* Revealed Destination */}
                {request.status === 'revealed' && request.assigned_destination && (
                    <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-5 w-5 text-green-500" />
                            <span className="font-semibold text-green-500">Your Surprise Destination</span>
                        </div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                            {request.assigned_destination}
                        </p>
                    </div>
                )}

                {/* Clue Progress */}
                {request.status !== 'pending' && request.status !== 'revealed' && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Clues Received</span>
                            <span className="text-sm text-muted-foreground">{cluesSent} / {totalClues}</span>
                        </div>
                        <Progress value={clueProgress} className="h-2" />
                    </div>
                )}

                {/* Latest Clue */}
                {request.clue_schedule && cluesSent > 0 && request.status !== 'revealed' && (
                    <div className="mb-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <div className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-purple-500 mb-1">Latest Clue (Week {cluesSent})</p>
                                <p className="text-sm text-foreground">
                                    {request.clue_schedule.find(c => c.week === cluesSent)?.clue_text}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Trip Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Travelers</p>
                            <p className="font-medium">{request.number_of_travelers} {request.number_of_travelers === 1 ? 'person' : 'people'}</p>
                        </div>
                    </div>

                    {request.budget_min && request.budget_max && (
                        <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Budget</p>
                                <p className="font-medium">
                                    ₹{request.budget_min.toLocaleString()} - ₹{request.budget_max.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}

                    {request.duration && (
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Duration</p>
                                <p className="font-medium">{request.duration}</p>
                            </div>
                        </div>
                    )}

                    {request.personality && (
                        <div className="flex items-center gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Personality</p>
                                <p className="font-medium capitalize">{request.personality.replace('_', ' ')}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Timestamps */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Requested {request.created_at && formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</span>
                    </div>
                </div>

                {/* Actions */}
                {onViewDetails && (
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => onViewDetails(request.id!)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                        <Sparkles className="h-4 w-4 mr-2" />
                        View All Clues & Details
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
