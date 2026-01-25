import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Profile, TravelPreferences } from '@/integrations/supabase/database.types';

export type { Profile, TravelPreferences };

export const useProfile = (userId: string) => useQuery({
  queryKey: ['profile', userId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data as Profile | null;
  },
  enabled: !!userId
});

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Profile> & { id: string }) => {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['profile', variables.id] });
    }
  });
};

export const useNeedsOnboarding = (userId: string) => useQuery({
  queryKey: ['needs-onboarding', userId],
  queryFn: async () => {
    const { data, error } = await (supabase as any)
      .from('profiles')
      .select('travel_preferences')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) throw error;
    
    // User needs onboarding if profile doesn't exist or travel_preferences is null/incomplete
    if (!data) return true;
    
    const prefs = data?.travel_preferences as TravelPreferences | null;
    if (!prefs) return true;
    if (!prefs.completed_at) return true;
    
    return false;
  },
  enabled: !!userId
});
