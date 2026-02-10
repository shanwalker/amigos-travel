import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ChatSessionCard } from '@/components/admin/ChatSessionCard';
import { MessageThread } from '@/components/admin/MessageThread';
import { getAllChatSessions, getSessionMessages } from '@/lib/supabase/chat-logging';
import { supabase } from '@/integrations/supabase/client';
import type { ChatSession, ChatMessage } from '@/lib/supabase/chat-logging';
import { Search, Loader2, MessageSquare, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function ChatHistoryManagement() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
    const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [userProfiles, setUserProfiles] = useState<Record<string, { email: string; full_name?: string }>>({});

    useEffect(() => {
        loadSessions();
    }, [userTypeFilter]);

    const loadSessions = async () => {
        setLoading(true);
        try {
            const filters = userTypeFilter !== 'all'
                ? { isAuthenticated: userTypeFilter === 'authenticated' }
                : undefined;

            const data = await getAllChatSessions(filters);
            setSessions(data);

            // Fetch user profiles for authenticated sessions
            const userIds = [...new Set(data.filter(s => s.user_id).map(s => s.user_id!))];
            const profiles: Record<string, { email: string; full_name?: string }> = {};

            for (const userId of userIds) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('email, full_name')
                    .eq('id', userId)
                    .single();

                if (profile) {
                    profiles[userId] = profile;
                }
            }

            setUserProfiles(profiles);
        } catch (error) {
            console.error('Error loading sessions:', error);
            toast.error('Failed to load chat sessions');
        } finally {
            setLoading(false);
        }
    };

    const handleViewSession = async (session: ChatSession) => {
        setSelectedSession(session);
        setLoadingMessages(true);
        try {
            const sessionMessages = await getSessionMessages(session.id);
            setMessages(sessionMessages);
        } catch (error) {
            console.error('Error loading messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoadingMessages(false);
        }
    };

    const filteredSessions = sessions.filter(session => {
        const user = session.user_id ? userProfiles[session.user_id] : null;
        const searchLower = searchQuery.toLowerCase();

        return (
            user?.email?.toLowerCase().includes(searchLower) ||
            user?.full_name?.toLowerCase().includes(searchLower) ||
            session.user_ip?.toLowerCase().includes(searchLower)
        );
    });

    const stats = {
        total: sessions.length,
        authenticated: sessions.filter(s => s.is_authenticated).length,
        anonymous: sessions.filter(s => !s.is_authenticated).length,
        avgMessages: sessions.length > 0
            ? Math.round(sessions.reduce((sum, s) => sum + s.total_messages, 0) / sessions.length)
            : 0,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Chat History</h1>
                <p className="text-gray-400 mt-1">View all AI chatbot conversations</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{stats.total}</div>
                                <div className="text-sm text-gray-400">Total Sessions</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{stats.authenticated}</div>
                                <div className="text-sm text-gray-400">Authenticated</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{stats.anonymous}</div>
                                <div className="text-sm text-gray-400">Anonymous</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{stats.avgMessages}</div>
                                <div className="text-sm text-gray-400">Avg Messages</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by user, email, or IP..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="authenticated">Authenticated</SelectItem>
                                <SelectItem value="anonymous">Anonymous</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredSessions.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            No chat sessions found
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredSessions.map((session) => {
                                const user = session.user_id ? userProfiles[session.user_id] : null;
                                // Get first user message as preview
                                const firstMessage = ''; // We'd need to fetch this separately

                                return (
                                    <ChatSessionCard
                                        key={session.id}
                                        session={session}
                                        userName={user?.full_name}
                                        userEmail={user?.email}
                                        firstMessage={firstMessage}
                                        onClick={() => handleViewSession(session)}
                                    />
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Session Detail Dialog */}
            <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedSession?.is_authenticated ? (
                                userProfiles[selectedSession.user_id!]?.full_name || 'User'
                            ) : (
                                `Anonymous User (${selectedSession?.user_ip})`
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-4">
                        {loadingMessages ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <MessageThread messages={messages} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
