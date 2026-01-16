import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Testimonial } from '@/integrations/supabase/database.types';

export type { Testimonial };

export const useTestimonials = () => useQuery({ queryKey: ['testimonials'], queryFn: async () => { const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false }); if (error) throw error; return data as Testimonial[]; } });
export const useCreateTestimonial = () => { const qc = useQueryClient(); return useMutation({ mutationFn: async (t: Omit<Testimonial, 'id' | 'created_at'>) => { const { data, error } = await (supabase as any).from('testimonials').insert(t).select().single(); if (error) throw error; return data as Testimonial; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials'] }) }); };
export const useUpdateTestimonial = () => { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ id, ...u }: Partial<Testimonial> & { id: string }) => { const { data, error } = await (supabase as any).from('testimonials').update(u).eq('id', id).select().single(); if (error) throw error; return data as Testimonial; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials'] }) }); };
export const useDeleteTestimonial = () => { const qc = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from('testimonials').delete().eq('id', id); if (error) throw error; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials'] }) }); };
