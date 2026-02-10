import { Badge } from '@/components/ui/badge';
import { User, Globe } from 'lucide-react';

interface ChatSessionCardProps {
    session: {
        id: string;
        user_id: string | null;
        is_authenticated: boolean;
        user_ip: string | null;
        session_started_at: string;
        total_messages: number;
        duration_seconds: number | null;
    };
    userName?: string;
    userEmail?: string;
    firstMessage?: string;
    onClick?: () => void;
}

export function ChatSessionCard({
    session,
    userName,
    userEmail,
    firstMessage,
    onClick
}: ChatSessionCardProps) {
    const formatDuration = (seconds: number | null) => {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    return (
        <div
            onClick={onClick}
            className="p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
        >
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${session.is_authenticated
                        ? 'bg-gradient-to-br from-primary to-orange-500'
                        : 'bg-gray-600'
                    }`}>
                    {session.is_authenticated ? (
                        <User className="w-6 h-6 text-white" />
                    ) : (
                        <Globe className="w-6 h-6 text-white" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* User Info */}
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">
                            {session.is_authenticated ? (
                                userName || 'Logged In User'
                            ) : (
                                'Anonymous User'
                            )}
                        </h3>
                        <Badge variant="outline" className={
                            session.is_authenticated
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }>
                            {session.is_authenticated ? 'Authenticated' : 'Anonymous'}
                        </Badge>
                    </div>

                    {/* Email or IP */}
                    <p className="text-sm text-gray-400 mb-2">
                        {session.is_authenticated ? (
                            userEmail || 'No email'
                        ) : (
                            `IP: ${session.user_ip || 'Unknown'}`
                        )}
                    </p>

                    {/* First Message Preview */}
                    {firstMessage && (
                        <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                            "{firstMessage}"
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>🕐 {formatTimeAgo(session.session_started_at)}</span>
                        <span>💬 {session.total_messages} messages</span>
                        <span>⏱️ {formatDuration(session.duration_seconds)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
