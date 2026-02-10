import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ProposalStatusBadge } from '@/components/proposal/ProposalStatusBadge';
import { getAllProposals, deleteProposal } from '@/lib/supabase/proposals';
import { supabase } from '@/integrations/supabase/client';
import type { TripProposal } from '@/types/proposals';
import { Search, Eye, Edit, Trash2, Plus, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ProposalsManagement() {
    const navigate = useNavigate();
    const [proposals, setProposals] = useState<TripProposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [users, setUsers] = useState<Record<string, { email: string; full_name?: string }>>({});

    useEffect(() => {
        loadProposals();
    }, [statusFilter]);

    const loadProposals = async () => {
        setLoading(true);
        try {
            const filters = statusFilter !== 'all' ? { status: statusFilter } : undefined;
            const data = await getAllProposals(filters);
            setProposals(data);

            // Fetch user details for each proposal
            const userIds = [...new Set(data.map(p => p.user_id))];
            const userDetails: Record<string, { email: string; full_name?: string }> = {};

            for (const userId of userIds) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('email, full_name')
                    .eq('id', userId)
                    .single();

                if (profile) {
                    userDetails[userId] = profile;
                }
            }

            setUsers(userDetails);
        } catch (error) {
            console.error('Error loading proposals:', error);
            toast.error('Failed to load proposals');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (proposalId: string) => {
        if (!confirm('Are you sure you want to delete this proposal?')) return;

        const result = await deleteProposal(proposalId);
        if (result.success) {
            toast.success('Proposal deleted');
            loadProposals();
        } else {
            toast.error(result.error || 'Failed to delete proposal');
        }
    };

    const filteredProposals = proposals.filter(proposal => {
        const user = users[proposal.user_id];
        const searchLower = searchQuery.toLowerCase();

        return (
            proposal.destination_name?.toLowerCase().includes(searchLower) ||
            proposal.title?.toLowerCase().includes(searchLower) ||
            user?.email?.toLowerCase().includes(searchLower) ||
            user?.full_name?.toLowerCase().includes(searchLower)
        );
    });

    const statusCounts = {
        all: proposals.length,
        draft: proposals.filter(p => p.status === 'draft').length,
        sent: proposals.filter(p => p.status === 'sent').length,
        viewed: proposals.filter(p => p.status === 'viewed').length,
        accepted: proposals.filter(p => p.status === 'accepted').length,
        declined: proposals.filter(p => p.status === 'declined').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Trip Proposals</h1>
                    <p className="text-gray-400 mt-1">Manage all trip proposals sent to users</p>
                </div>
                <Button
                    onClick={() => navigate('/admin/proposal-builder')}
                    className="bg-gradient-to-r from-primary to-orange-500"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Proposal
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {Object.entries(statusCounts).map(([status, count]) => (
                    <Card
                        key={status}
                        className={`cursor-pointer transition-all ${statusFilter === status ? 'ring-2 ring-primary' : ''
                            }`}
                        onClick={() => setStatusFilter(status)}
                    >
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-white">{count}</div>
                            <div className="text-sm text-gray-400 capitalize">{status}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by destination, user, or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="viewed">Viewed</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                                <SelectItem value="declined">Declined</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredProposals.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            No proposals found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Destination</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Sent Date</TableHead>
                                        <TableHead>Response</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProposals.map((proposal) => {
                                        const user = users[proposal.user_id];
                                        return (
                                            <TableRow key={proposal.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium text-white">
                                                            {user?.full_name || 'Unknown User'}
                                                        </div>
                                                        <div className="text-sm text-gray-400">
                                                            {user?.email}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium text-white">
                                                            {proposal.destination_name}
                                                        </div>
                                                        <div className="text-sm text-gray-400">
                                                            {proposal.title}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <ProposalStatusBadge status={proposal.status} />
                                                </TableCell>
                                                <TableCell>
                                                    {proposal.sent_at ? (
                                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                                            <Calendar className="w-4 h-4" />
                                                            {format(new Date(proposal.sent_at), 'MMM d, yyyy')}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">Not sent</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {proposal.response_notes ? (
                                                        <div className="text-sm text-gray-400 max-w-xs truncate">
                                                            {proposal.response_notes}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => navigate(`/admin/proposals/${proposal.id}`)}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => navigate(`/admin/proposal-builder?id=${proposal.id}`)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => handleDelete(proposal.id)}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
