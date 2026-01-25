import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Trip, TripType, TripStatus } from '@/integrations/supabase/database.types';

export const useFeaturedTrips = () => useQuery({
  queryKey: ['featured-trips'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('is_featured', true)
      .eq('status', 'active')
      .order('start_date', { ascending: true });
    if (error) throw error;
    return data as Trip[];
  }
});

export const useGroupTrips = (type?: 'group_fixed' | 'group_reservable') => useQuery({
  queryKey: ['group-trips', type],
  queryFn: async () => {
    let query = supabase
      .from('trips')
      .select('*')
      .eq('status', 'active');
    
    if (type) {
      query = query.eq('trip_type', type);
    } else {
      query = query.in('trip_type', ['group_fixed', 'group_reservable']);
    }
    
    const { data, error } = await query.order('start_date', { ascending: true });
    if (error) throw error;
    return data as Trip[];
  }
});

export const useStandardPackages = () => useQuery({
  queryKey: ['standard-packages'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('trip_type', 'standard')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Trip[];
  }
});

export const useTripsByCategory = (category: string) => useQuery({
  queryKey: ['trips-category', category],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('category', category)
      .eq('status', 'active')
      .order('start_date', { ascending: true });
    if (error) throw error;
    return data as Trip[];
  },
  enabled: !!category
});

export const useTripsByBudget = (minBudget: number, maxBudget: number) => useQuery({
  queryKey: ['trips-budget', minBudget, maxBudget],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .lte('min_budget', maxBudget)
      .gte('max_budget', minBudget)
      .eq('status', 'active')
      .order('price', { ascending: true });
    if (error) throw error;
    return data as Trip[];
  }
});

export const useTripsFiltered = (filters: {
  tripType?: TripType;
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  status?: TripStatus;
}) => useQuery({
  queryKey: ['trips-filtered', filters],
  queryFn: async () => {
    let query = supabase
      .from('trips')
      .select('*');
    
    if (filters.tripType) query = query.eq('trip_type', filters.tripType);
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.minBudget) query = query.gte('max_budget', filters.minBudget);
    if (filters.maxBudget) query = query.lte('min_budget', filters.maxBudget);
    if (filters.status) query = query.eq('status', filters.status);
    else query = query.eq('status', 'active');
    
    const { data, error } = await query.order('start_date', { ascending: true });
    if (error) throw error;
    return data as Trip[];
  }
});

export const useReservableTripsWithCount = () => useQuery({
  queryKey: ['reservable-trips-count'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('trip_type', 'group_reservable')
      .eq('status', 'active')
      .order('reservation_count', { ascending: false });
    if (error) throw error;
    return data as Trip[];
  }
});
