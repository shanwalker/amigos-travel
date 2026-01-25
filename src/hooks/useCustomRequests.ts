import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CustomTripRequest } from '@/integrations/supabase/database.types';

export type { CustomTripRequest };

export const useCustomRequests = () => useQuery({
  queryKey: ['custom-requests'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('custom_trip_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as CustomTripRequest[];
  }
});

export const useCustomRequest = (id: string) => useQuery({
  queryKey: ['custom-request', id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('custom_trip_requests')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as CustomTripRequest;
  },
  enabled: !!id
});

export const useUserCustomRequests = (userId: string) => useQuery({
  queryKey: ['user-custom-requests', userId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('custom_trip_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as CustomTripRequest[];
  },
  enabled: !!userId
});

export const useCreateCustomRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (request: Omit<CustomTripRequest, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await (supabase as any)
        .from('custom_trip_requests')
        .insert(request)
        .select()
        .single();
      if (error) throw error;
      return data as CustomTripRequest;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['custom-requests'] })
  });
};

export const useUpdateCustomRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CustomTripRequest> & { id: string }) => {
      const { data, error } = await (supabase as any)
        .from('custom_trip_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as CustomTripRequest;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['custom-requests'] })
  });
};
