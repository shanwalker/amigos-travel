import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, DollarSign, Clock, MessageSquare } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { CustomRequestWithUser } from '@/lib/supabase/custom-requests';

interface RequestCardProps {
    request: CustomRequestWithUser;
    onViewDetails?: (id: string) => void;
}

export function RequestCard({ request, onViewDetails }: RequestCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-500/10 text-green-500 border-green-500/30';
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
            case 'reviewing':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
            case 'rejected':
                return 'bg-red-500/10 text-red-500 border-red-500/30';
            case 'completed':
                return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-500/10 text-red-500';
            case 'medium':
                return 'bg-yellow-500/10 text-yellow-500';
            case 'low':
                return 'bg-green-500/10 text-green-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return '⏳';
            case 'reviewing':
                return '👀';
            case 'approved':
                return '✅';
            case 'rejected':
                return '❌';
            case 'completed':
                return '🎉';
            default:
                return '📝';
        }
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl">{getStatusIcon(request.status)}</div>
                        <div>
                            <h3 className="text-lg font-semibold mb-1">
                                Custom Trip Request
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Ref: {request.request_reference}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline" className={getStatusColor(request.status)}>
                            {request.status}
                        </Badge>
                        {request.priority && (
                            <Badge variant="secondary" className={getPriorityColor(request.priority)}>
                                {request.priority}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Request Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {request.destination && (
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Destination</p>
                                <p className="font-medium">{request.destination}</p>
                            </div>
                        </div>
                    )}

                    {request.travel_dates && (
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Travel Dates</p>
                                <p className="font-medium">
                                    {format(new Date(request.travel_dates.start), 'MMM dd')} -
                                    {format(new Date(request.travel_dates.end), 'MMM dd, yyyy')}
                                </p>
                            </div>
                        </div>
                    )}

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
                </div>

                {/* Admin Response */}
                {request.admin_response && (
                    <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-blue-500 mb-1">Response from Travel Amigo</p>
                                <p className="text-sm text-foreground">{request.admin_response}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Estimated Cost */}
                {request.estimated_cost && (
                    <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-500">Estimated Cost</span>
                            <span className="text-lg font-bold text-green-500">₹{request.estimated_cost.toLocaleString()}</span>
                        </div>
                    </div>
                )}

                {/* Timestamps */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Submitted {request.created_at && formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</span>
                    </div>
                    {request.reviewed_at && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Reviewed {formatDistanceToNow(new Date(request.reviewed_at), { addSuffix: true })}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                {onViewDetails && (
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => onViewDetails(request.id!)}
                        className="w-full"
                    >
                        View Full Details
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
