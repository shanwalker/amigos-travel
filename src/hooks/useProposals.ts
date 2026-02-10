import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TripProposal, CreateProposalInput, UpdateProposalInput } from '@/types/proposals';

// Fetch all proposals for current user
export const useProposals = () => {
    return useQuery({
        queryKey: ['proposals'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('trip_proposals')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as TripProposal[];
        },
    });
};

// Fetch single proposal by ID
export const useProposal = (id: string | undefined) => {
    return useQuery({
        queryKey: ['proposal', id],
        queryFn: async () => {
            if (!id) return null;

            console.log('Fetching proposal with ID:', id);

            const { data, error } = await supabase
                .from('trip_proposals')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching proposal:', error);
                throw error;
            }

            console.log('Proposal data:', data);
            return data as TripProposal;
        },
        enabled: !!id,
        retry: false, // Don't retry on error for debugging
    });
};

// Fetch all proposals (admin only)
export const useAllProposals = () => {
    return useQuery({
        queryKey: ['all-proposals'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('trip_proposals')
                .select(`
          *,
          user:profiles!trip_proposals_user_id_fkey(full_name, email)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
    });
};

// Create new proposal
export const useCreateProposal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateProposalInput) => {
            const { data: { user } } = await supabase.auth.getUser();

            const { data, error } = await supabase
                .from('trip_proposals')
                .insert({
                    ...input,
                    created_by: user?.id,
                    deposit_amount: input.total_price * ((input.deposit_percentage || 25) / 100),
                } as any)
                .select()
                .single();

            if (error) throw error;
            return data as TripProposal;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proposals'] });
            queryClient.invalidateQueries({ queryKey: ['all-proposals'] });
        },
    });
};

// Update proposal
export const useUpdateProposal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: UpdateProposalInput) => {
            const { data, error } = await (supabase
                .from('trip_proposals') as any)
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data as TripProposal;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['proposals'] });
            queryClient.invalidateQueries({ queryKey: ['proposal', data.id] });
            queryClient.invalidateQueries({ queryKey: ['all-proposals'] });
        },
    });
};

// Delete proposal
export const useDeleteProposal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('trip_proposals')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proposals'] });
            queryClient.invalidateQueries({ queryKey: ['all-proposals'] });
        },
    });
};

// Publish proposal (changes status to published)
export const usePublishProposal = () => {
    const updateProposal = useUpdateProposal();

    return useMutation({
        mutationFn: async (id: string) => {
            return updateProposal.mutateAsync({ id, status: 'sent' });
        },
    });
};
