import { supabase } from '@/integrations/supabase/client';
import type { TripProposal } from '@/types/proposals';

/**
 * Send a proposal to a user (change status from draft to sent)
 */
export async function sendProposal(proposalId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase
            .from('trip_proposals')
            .update({
                status: 'sent',
                sent_at: new Date().toISOString()
            })
            .eq('id', proposalId);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('[sendProposal] Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Mark a proposal as viewed by the user
 */
export async function markProposalViewed(proposalId: string): Promise<{ success: boolean; error?: string }> {
    try {
        // Only update if not already viewed
        const { data: existing } = await supabase
            .from('trip_proposals')
            .select('viewed_at')
            .eq('id', proposalId)
            .single();

        if (existing?.viewed_at) {
            return { success: true }; // Already viewed
        }

        const { error } = await supabase
            .from('trip_proposals')
            .update({
                status: 'viewed',
                viewed_at: new Date().toISOString()
            })
            .eq('id', proposalId)
            .eq('status', 'sent'); // Only update if currently 'sent'

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('[markProposalViewed] Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update proposal status (accept or decline)
 */
export async function updateProposalStatus(
    proposalId: string,
    status: 'accepted' | 'declined',
    notes?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase
            .from('trip_proposals')
            .update({
                status,
                responded_at: new Date().toISOString(),
                response_notes: notes || null
            })
            .eq('id', proposalId);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('[updateProposalStatus] Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all proposals for a specific user
 */
export async function getUserProposals(userId: string): Promise<TripProposal[]> {
    try {
        const { data, error } = await supabase
            .from('trip_proposals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data as TripProposal[]) || [];
    } catch (error) {
        console.error('[getUserProposals] Error:', error);
        return [];
    }
}

/**
 * Get all proposals (admin only)
 */
export async function getAllProposals(filters?: {
    status?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
}): Promise<TripProposal[]> {
    try {
        let query = supabase
            .from('trip_proposals')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        if (filters?.userId) {
            query = query.eq('user_id', filters.userId);
        }

        if (filters?.startDate) {
            query = query.gte('created_at', filters.startDate);
        }

        if (filters?.endDate) {
            query = query.lte('created_at', filters.endDate);
        }

        const { data, error } = await query;

        if (error) throw error;

        return (data as TripProposal[]) || [];
    } catch (error) {
        console.error('[getAllProposals] Error:', error);
        return [];
    }
}

/**
 * Get proposal by ID
 */
export async function getProposalById(proposalId: string): Promise<TripProposal | null> {
    try {
        const { data, error } = await supabase
            .from('trip_proposals')
            .select('*')
            .eq('id', proposalId)
            .single();

        if (error) throw error;

        return data as TripProposal;
    } catch (error) {
        console.error('[getProposalById] Error:', error);
        return null;
    }
}

/**
 * Delete a proposal (admin only)
 */
export async function deleteProposal(proposalId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase
            .from('trip_proposals')
            .delete()
            .eq('id', proposalId);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('[deleteProposal] Error:', error);
        return { success: false, error: error.message };
    }
}
