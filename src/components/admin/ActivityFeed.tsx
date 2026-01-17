import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Calendar,
    UserPlus,
    CheckCircle,
    XCircle,
    Star,
    Clock,
    Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
    id: string;
    type: 'booking' | 'user' | 'review' | 'cancellation';
    title: string;
    description: string;
    timestamp: Date;
    status?: 'success' | 'pending' | 'error';
}

interface ActivityFeedProps {
    activities?: ActivityItem[];
}

export const ActivityFeed = ({ activities = [] }: ActivityFeedProps) => {
    // Generate sample activities if none provided
    const sampleActivities: ActivityItem[] = activities.length > 0 ? activities : [
        {
            id: '1',
            type: 'booking',
            title: 'New Booking',
            description: 'John Doe booked "Bali Adventure" for 2 travelers',
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
            status: 'pending',
        },
        {
            id: '2',
            type: 'user',
            title: 'New User Registration',
            description: 'Sarah Smith signed up',
            timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
            status: 'success',
        },
        {
            id: '3',
            type: 'booking',
            title: 'Booking Confirmed',
            description: 'Payment received for "Thailand Escape"',
            timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
            status: 'success',
        },
        {
            id: '4',
            type: 'review',
            title: 'New Review',
            description: 'Mike Johnson left a 5-star review',
            timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
            status: 'success',
        },
        {
            id: '5',
            type: 'cancellation',
            title: 'Booking Cancelled',
            description: 'Emma Wilson cancelled "Vietnam Tour"',
            timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
            status: 'error',
        },
    ];

    const getIcon = (type: ActivityItem['type']) => {
        switch (type) {
            case 'booking':
                return Calendar;
            case 'user':
                return UserPlus;
            case 'review':
                return Star;
            case 'cancellation':
                return XCircle;
            default:
                return Activity;
        }
    };

    const getStatusColor = (status?: ActivityItem['status']) => {
        switch (status) {
            case 'success':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'error':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    };

    const getIconColor = (type: ActivityItem['type']) => {
        switch (type) {
            case 'booking':
                return 'text-blue-400';
            case 'user':
                return 'text-green-400';
            case 'review':
                return 'text-yellow-400';
            case 'cancellation':
                return 'text-red-400';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <Card className="bg-card/50 border-border/50">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <CardTitle className="text-foreground">Recent Activity</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                        {sampleActivities.map((activity, index) => {
                            const Icon = getIcon(activity.type);
                            return (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-colors"
                                >
                                    <div className={`p-2 rounded-lg bg-background ${getIconColor(activity.type)}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-foreground">{activity.title}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                    {activity.description}
                                                </p>
                                            </div>
                                            {activity.status && (
                                                <Badge variant="outline" className={`text-xs ${getStatusColor(activity.status)}`}>
                                                    {activity.status}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};
