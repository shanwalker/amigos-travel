import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Trip, ItineraryItem } from '@/integrations/supabase/database.types';

export type { Trip };

export const useTrips = () => useQuery({ queryKey: ['trips'], queryFn: async () => { const { data, error } = await supabase.from('trips').select('*').order('start_date', { ascending: true }); if (error) throw error; return data as Trip[]; } });
export const useTrip = (id: string) => useQuery({ queryKey: ['trip', id], queryFn: async () => { const { data, error } = await supabase.from('trips').select('*').eq('id', id).single(); if (error) throw error; return data as Trip; }, enabled: !!id });
export const useTripWithItinerary = (tripId: string) => useQuery({ queryKey: ['trip-itinerary', tripId], queryFn: async () => { const [t, i] = await Promise.all([supabase.from('trips').select('*').eq('id', tripId).single(), supabase.from('itinerary_items').select('*').eq('trip_id', tripId).order('day_number')]); if (t.error) throw t.error; if (i.error) throw i.error; return { trip: t.data as Trip, itinerary: i.data as ItineraryItem[] }; }, enabled: !!tripId });
export const useUpcomingTrip = () => useQuery({ queryKey: ['upcoming-trip'], queryFn: async () => { const { data, error } = await supabase.from('trips').select('*').gte('start_date', new Date().toISOString().split('T')[0]).order('start_date', { ascending: true }).limit(1).maybeSingle(); if (error) throw error; return data as Trip | null; } });

export const useCreateTrip = () => { const qc = useQueryClient(); return useMutation({ mutationFn: async (trip: Omit<Trip, 'id' | 'created_at'>) => { const { data, error } = await (supabase as any).from('trips').insert(trip).select().single(); if (error) throw error; return data as Trip; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }) }); };
export const useUpdateTrip = () => { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ id, ...u }: Partial<Trip> & { id: string }) => { const { data, error } = await (supabase as any).from('trips').update(u).eq('id', id).select().single(); if (error) throw error; return data as Trip; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }) }); };
export const useDeleteTrip = () => { const qc = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from('trips').delete().eq('id', id); if (error) throw error; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }) }); };
