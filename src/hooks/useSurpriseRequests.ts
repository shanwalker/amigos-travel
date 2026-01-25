import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SurpriseRequest } from '@/integrations/supabase/database.types';

export type { SurpriseRequest };

export const useSurpriseRequests = () => useQuery({
  queryKey: ['surprise-requests'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('surprise_requests')
      .select(`
        *,
        profiles:user_id (
          id,
          full_name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as (SurpriseRequest & { profiles: { id: string; full_name: string | null; email: string | null; phone: string | null } | null })[];
  }
});

export const useSurpriseRequest = (id: string) => useQuery({
  queryKey: ['surprise-request', id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('surprise_requests')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as SurpriseRequest;
  },
  enabled: !!id
});

export const useUserSurpriseRequests = (userId: string) => useQuery({
  queryKey: ['user-surprise-requests', userId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('surprise_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as SurpriseRequest[];
  },
  enabled: !!userId
});

export const useCreateSurpriseRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (request: Omit<SurpriseRequest, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await (supabase as any)
        .from('surprise_requests')
        .insert(request)
        .select()
        .single();
      if (error) throw error;
      return data as SurpriseRequest;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['surprise-requests'] })
  });
};

export const useUpdateSurpriseRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SurpriseRequest> & { id: string }) => {
      const { data, error } = await (supabase as any)
        .from('surprise_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as SurpriseRequest;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['surprise-requests'] })
  });
};
