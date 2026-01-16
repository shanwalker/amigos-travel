import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TravelStory } from '@/integrations/supabase/database.types';

export type { TravelStory };

export const useTravelStories = () => useQuery({ queryKey: ['travel-stories'], queryFn: async () => { const { data, error } = await supabase.from('travel_stories').select('*').order('published_at', { ascending: false }); if (error) throw error; return data as TravelStory[]; } });
export const useFeaturedStories = () => useQuery({ queryKey: ['featured-stories'], queryFn: async () => { const { data, error } = await supabase.from('travel_stories').select('*').eq('featured', true).order('published_at', { ascending: false }).limit(3); if (error) throw error; return data as TravelStory[]; } });
export const useCreateTravelStory = () => { const qc = useQueryClient(); return useMutation({ mutationFn: async (s: Omit<TravelStory, 'id' | 'created_at'>) => { const { data, error } = await (supabase as any).from('travel_stories').insert(s).select().single(); if (error) throw error; return data as TravelStory; }, onSuccess: () => { qc.invalidateQueries({ queryKey: ['travel-stories'] }); qc.invalidateQueries({ queryKey: ['featured-stories'] }); } }); };
export const useUpdateTravelStory = () => { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ id, ...u }: Partial<TravelStory> & { id: string }) => { const { data, error } = await (supabase as any).from('travel_stories').update(u).eq('id', id).select().single(); if (error) throw error; return data as TravelStory; }, onSuccess: () => { qc.invalidateQueries({ queryKey: ['travel-stories'] }); qc.invalidateQueries({ queryKey: ['featured-stories'] }); } }); };
export const useDeleteTravelStory = () => { const qc = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from('travel_stories').delete().eq('id', id); if (error) throw error; }, onSuccess: () => { qc.invalidateQueries({ queryKey: ['travel-stories'] }); qc.invalidateQueries({ queryKey: ['featured-stories'] }); } }); };
