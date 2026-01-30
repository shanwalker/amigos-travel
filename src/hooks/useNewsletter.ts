import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Subscriber {
    id: string;
    email: string;
    status: 'subscribed' | 'unsubscribed';
    source: string;
    subscribed_at: string;
}

export interface Campaign {
    id: string;
    title: string;
    subject: string;
    content: string;
    status: 'draft' | 'sending' | 'sent';
    sent_at: string | null;
    recipient_count: number;
    open_rate: number;
    click_rate: number;
    created_at: string;
}

// Check if tables exist helper
const checkTable = async (table: string) => {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error && error.code === '42P01') return false;
    return true;
};

export const useSubscribers = () => {
    return useQuery({
        queryKey: ['subscribers'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('newsletter_subscribers')
                .select('*')
                .order('subscribed_at', { ascending: false });

            if (error) {
                if (error.code === '42P01') return [];
                throw error;
            }
            return data as Subscriber[];
        },
    });
};

export const useCampaigns = () => {
    return useQuery({
        queryKey: ['campaigns'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('newsletter_campaigns')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                if (error.code === '42P01') return [];
                throw error;
            }
            return data as Campaign[];
        },
    });
};

export const useCreateCampaign = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (campaign: Partial<Campaign>) => {
            const { error } = await (supabase as any)
                .from('newsletter_campaigns')
                .insert([campaign]);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
    });
};

export const useSendCampaign = () => {
    const queryClient = useQueryClient();
    // In a real app, this would trigger an Edge Function
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await (supabase as any)
                .from('newsletter_campaigns')
                .update({ status: 'sent', sent_at: new Date().toISOString() })
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
    });
};
