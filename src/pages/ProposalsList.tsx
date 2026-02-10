import { useProposals } from '@/hooks/useProposals';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, Clock, Eye } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function ProposalsList() {
    const { data: proposals, isLoading } = useProposals();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!proposals || proposals.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-6">
                        <MapPin className="w-16 h-16 mx-auto text-muted-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">No Trip Proposals Yet</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Your personalized trip proposals will appear here once our team creates them for you.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Have you completed the quiz? That's the first step to getting your custom proposal!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Your Trip Proposals</h1>
                <p className="text-muted-foreground">
                    View and manage your personalized travel proposals
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proposals.map((proposal) => (
                    <Card key={proposal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        {proposal.hero_image_url && (
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={proposal.hero_image_url}
                                    alt={proposal.destination_name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <StatusBadge status={proposal.status} />
                                </div>
                            </div>
                        )}

                        <div className="p-6">
                            <div className="flex items-start gap-2 mb-3">
                                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <h3 className="text-xl font-semibold">{proposal.destination_name}</h3>
                            </div>

                            {proposal.destination_tagline && (
                                <p className="text-sm text-muted-foreground mb-4">
                                    {proposal.destination_tagline}
                                </p>
                            )}

                            <div className="space-y-2 mb-4 text-sm">
                                {proposal.departure_date && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {new Date(proposal.departure_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                )}

                                {proposal.duration_days && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>{proposal.duration_days} days</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 font-semibold text-primary">
                                    <DollarSign className="w-4 h-4" />
                                    <span>₹{proposal.total_price.toLocaleString()}</span>
                                </div>
                            </div>

                            {proposal.expiry_date && new Date(proposal.expiry_date) > new Date() && (
                                <p className="text-xs text-muted-foreground mb-4">
                                    Expires {new Date(proposal.expiry_date).toLocaleDateString()}
                                </p>
                            )}

                            <Link to={`/dashboard/proposals/${proposal.id}`}>
                                <Button className="w-full" variant={proposal.status === 'sent' ? 'default' : 'outline'}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Proposal
                                </Button>
                            </Link>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
        draft: { label: 'Draft', variant: 'secondary' },
        sent: { label: 'New', variant: 'default' },
        viewed: { label: 'Viewed', variant: 'outline' },
        accepted: { label: 'Accepted', variant: 'default' },
        declined: { label: 'Declined', variant: 'destructive' },
    };

    const config = variants[status] || { label: status, variant: 'outline' };

    return <Badge variant={config.variant}>{config.label}</Badge>;
}
