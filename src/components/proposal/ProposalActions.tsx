import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, MessageSquare, Loader2 } from 'lucide-react';
import { updateProposalStatus } from '@/lib/supabase/proposals';
import { toast } from 'sonner';

interface ProposalActionsProps {
    proposalId: string;
    currentStatus: string;
    onStatusUpdate?: () => void;
}

export function ProposalActions({ proposalId, currentStatus, onStatusUpdate }: ProposalActionsProps) {
    const [showDeclineDialog, setShowDeclineDialog] = useState(false);
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [declineNotes, setDeclineNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // Don't show actions if already responded
    if (currentStatus === 'accepted' || currentStatus === 'declined') {
        return null;
    }

    const handleAccept = async () => {
        setLoading(true);
        try {
            const result = await updateProposalStatus(proposalId, 'accepted');

            if (result.success) {
                toast.success('Proposal accepted! 🎉');
                setShowAcceptDialog(false);
                onStatusUpdate?.();
            } else {
                toast.error(result.error || 'Failed to accept proposal');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDecline = async () => {
        if (!declineNotes.trim()) {
            toast.error('Please provide a reason for declining');
            return;
        }

        setLoading(true);
        try {
            const result = await updateProposalStatus(proposalId, 'declined', declineNotes);

            if (result.success) {
                toast.success('Proposal declined');
                setShowDeclineDialog(false);
                setDeclineNotes('');
                onStatusUpdate?.();
            } else {
                toast.error(result.error || 'Failed to decline proposal');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex gap-3">
                <Button
                    onClick={() => setShowAcceptDialog(true)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Accept Proposal
                </Button>
                <Button
                    onClick={() => setShowDeclineDialog(true)}
                    variant="outline"
                    className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                    <XCircle className="w-4 h-4 mr-2" />
                    Decline
                </Button>
            </div>

            {/* Accept Confirmation Dialog */}
            <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Accept This Proposal?</DialogTitle>
                        <DialogDescription>
                            By accepting, you're confirming your interest in this trip. Our team will reach out to you shortly with next steps.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowAcceptDialog(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAccept}
                            disabled={loading}
                            className="bg-gradient-to-r from-green-600 to-emerald-600"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Accepting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Yes, Accept
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Decline Dialog with Notes */}
            <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Decline This Proposal</DialogTitle>
                        <DialogDescription>
                            Please let us know why you're declining so we can better understand your preferences.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="decline-notes">
                                Reason for declining <span className="text-red-400">*</span>
                            </Label>
                            <Textarea
                                id="decline-notes"
                                placeholder="e.g., Dates don't work for me, Budget is too high, Not interested in this destination..."
                                value={declineNotes}
                                onChange={(e) => setDeclineNotes(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDeclineDialog(false);
                                setDeclineNotes('');
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDecline}
                            disabled={loading || !declineNotes.trim()}
                            variant="destructive"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Declining...
                                </>
                            ) : (
                                <>
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Submit & Decline
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
