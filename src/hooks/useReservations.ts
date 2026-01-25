import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TripReservation } from '@/integrations/supabase/database.types';

export type { TripReservation };

export const useReservations = () => useQuery({
  queryKey: ['reservations'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('trip_reservations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as TripReservation[];
  }
});

export const useReservation = (id: string) => useQuery({
  queryKey: ['reservation', id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('trip_reservations')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as TripReservation;
  },
  enabled: !!id
});

export const useUserReservations = (userId: string) => useQuery({
  queryKey: ['user-reservations', userId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('trip_reservations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as TripReservation[];
  },
  enabled: !!userId
});

export const useTripReservations = (tripId: string) => useQuery({
  queryKey: ['trip-reservations', tripId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('trip_reservations')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as TripReservation[];
  },
  enabled: !!tripId
});

export const useCreateReservation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reservation: Omit<TripReservation, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await (supabase as any)
        .from('trip_reservations')
        .insert(reservation)
        .select()
        .single();
      if (error) throw error;
      return data as TripReservation;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reservations'] });
      qc.invalidateQueries({ queryKey: ['trips'] });
    }
  });
};

export const useUpdateReservation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TripReservation> & { id: string }) => {
      const { data, error } = await (supabase as any)
        .from('trip_reservations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as TripReservation;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] })
  });
};

export const useCancelReservation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('trip_reservations')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reservations'] });
      qc.invalidateQueries({ queryKey: ['trips'] });
    }
  });
};
