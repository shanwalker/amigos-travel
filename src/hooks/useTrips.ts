import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Trip, ItineraryItem } from '@/integrations/supabase/database.types';

export type { Trip };

export const useTrips = () => {
  return useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data as Trip[];
    },
  });
};

export const useTrip = (id: string) => {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Trip;
    },
    enabled: !!id,
  });
};

export const useTripWithItinerary = (tripId: string) => {
  return useQuery({
    queryKey: ['trip-itinerary', tripId],
    queryFn: async () => {
      const [tripResult, itineraryResult] = await Promise.all([
        supabase.from('trips').select('*').eq('id', tripId).single(),
        supabase.from('itinerary_items').select('*').eq('trip_id', tripId).order('day_number'),
      ]);
      
      if (tripResult.error) throw tripResult.error;
      if (itineraryResult.error) throw itineraryResult.error;
      
      return {
        trip: tripResult.data as Trip,
        itinerary: itineraryResult.data as ItineraryItem[],
      };
    },
    enabled: !!tripId,
  });
};

export const useUpcomingTrip = () => {
  return useQuery({
    queryKey: ['upcoming-trip'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .gte('start_date', new Date().toISOString().split('T')[0])
        .order('start_date', { ascending: true })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as Trip | null;
    },
  });
};
