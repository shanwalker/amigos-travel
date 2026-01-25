import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { LocalBuddy } from '@/integrations/supabase/database.types';

export type { LocalBuddy };

export const useLocalBuddies = () => useQuery({
  queryKey: ['local-buddies'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('local_buddies')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as LocalBuddy[];
  }
});

export const useLocalBuddy = (id: string) => useQuery({
  queryKey: ['local-buddy', id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('local_buddies')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as LocalBuddy;
  },
  enabled: !!id
});

export const useLocalBuddyByUser = (userId: string) => useQuery({
  queryKey: ['local-buddy-user', userId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('local_buddies')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data as LocalBuddy | null;
  },
  enabled: !!userId
});

export const useActiveBuddies = (city?: string, country?: string) => useQuery({
  queryKey: ['active-buddies', city, country],
  queryFn: async () => {
    let query = supabase
      .from('local_buddies')
      .select('*')
      .eq('is_active', true)
      .eq('is_verified', true);
    
    if (city) query = query.eq('city', city);
    if (country) query = query.eq('country', country);
    
    const { data, error } = await query.order('rating', { ascending: false });
    if (error) throw error;
    return data as LocalBuddy[];
  }
});

export const useCreateLocalBuddy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (buddy: Omit<LocalBuddy, 'id' | 'created_at' | 'total_trips'>) => {
      const { data, error } = await (supabase as any)
        .from('local_buddies')
        .insert(buddy)
        .select()
        .single();
      if (error) throw error;
      return data as LocalBuddy;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['local-buddies'] })
  });
};

export const useUpdateLocalBuddy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<LocalBuddy> & { id: string }) => {
      const { data, error } = await (supabase as any)
        .from('local_buddies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as LocalBuddy;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['local-buddies'] })
  });
};
