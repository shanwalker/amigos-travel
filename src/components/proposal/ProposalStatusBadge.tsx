import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Eye, XCircle, FileText } from 'lucide-react';

interface ProposalStatusBadgeProps {
    status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined';
    className?: string;
}

const statusConfig = {
    draft: {
        label: 'Draft',
        color: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        icon: FileText,
    },
    sent: {
        label: 'Sent',
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        icon: Clock,
    },
    viewed: {
        label: 'Viewed',
        color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        icon: Eye,
    },
    accepted: {
        label: 'Accepted',
        color: 'bg-green-500/10 text-green-400 border-green-500/20',
        icon: CheckCircle2,
    },
    declined: {
        label: 'Declined',
        color: 'bg-red-500/10 text-red-400 border-red-500/20',
        icon: XCircle,
    },
};

export function ProposalStatusBadge({ status, className = '' }: ProposalStatusBadgeProps) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <Badge
            variant="outline"
            className={`${config.color} ${className} flex items-center gap-1.5 px-2.5 py-1`}
        >
            <Icon className="w-3.5 h-3.5" />
            <span className="font-medium">{config.label}</span>
        </Badge>
    );
}
