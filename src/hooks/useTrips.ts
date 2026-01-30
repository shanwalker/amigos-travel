import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Trip } from '@/integrations/supabase/database.types';

// Types for related tables
export interface ItineraryItem {
    id: string;
    trip_id: string;
    day_number: number;
    title: string;
    description: string;
    icon?: string;
    image_url?: string;
    gradient?: string;
}

export interface TripImage {
    id: string;
    trip_id: string;
    url: string;
    is_featured: boolean;
    order: number;
}

export interface TripDate {
    id: string;
    trip_id: string;
    start_date: string;
    end_date?: string;
    spots_total: number;
    spots_booked: number;
    price_modifier: number;
    status: 'active' | 'sold_out' | 'cancelled';
}

export interface PricingVariation {
    id: string;
    trip_id: string;
    type: 'early_bird' | 'group' | 'seasonal' | 'addon';
    name: string;
    amount: number;
    is_percentage: boolean;
    conditions?: string;
    is_active: boolean;
}

export type { Trip };

// --- Trips Hooks ---

export const useTrips = () => useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
        const { data, error } = await supabase
            .from('trips')
            .select('*')
            .order('start_date', { ascending: true });
        if (error) throw error;
        return data as Trip[];
    }
});

// Get the next upcoming trip (closest future start_date)
export const useUpcomingTrip = () => useQuery({
    queryKey: ['upcoming-trip'],
    queryFn: async () => {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('trips')
            .select('*')
            .gte('start_date', today)
            .order('start_date', { ascending: true })
            .limit(1)
            .single();
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
        return data as Trip | null;
    }
});

export const useTrip = (id: string) => useQuery({
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
    enabled: !!id
});

// Get trip with itinerary for trip details page
export const useTripWithItinerary = (id: string) => useQuery({
    queryKey: ['trip-with-itinerary', id],
    queryFn: async () => {
        const { data: trip, error: tripError } = await supabase
            .from('trips')
            .select('*')
            .eq('id', id)
            .single();
        if (tripError) throw tripError;

        const { data: itinerary, error: itinError } = await supabase
            .from('itinerary_items')
            .select('*')
            .eq('trip_id', id)
            .order('day_number');
        
        return {
            trip: trip as Trip,
            itinerary: (itinError?.code === '42P01' ? [] : itinerary || []) as ItineraryItem[]
        };
    },
    enabled: !!id
});

// --- Mutations ---

export const useCreateTrip = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (trip: Partial<Trip>) => {
            const { data, error } = await (supabase as any)
                .from('trips')
                .insert(trip)
                .select()
                .single();
            if (error) throw error;
            return data as Trip;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] })
    });
};

export const useUpdateTrip = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<Trip> & { id: string }) => {
            const { data, error } = await (supabase as any)
                .from('trips')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data as Trip;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] })
    });
};

export const useDeleteTrip = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('trips').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] })
    });
};

// --- Sub-resource Hooks ---

export const useTripItinerary = (tripId: string) => useQuery({
    queryKey: ['trip-itinerary', tripId],
    queryFn: async () => {
        const { data, error } = await supabase
            .from('itinerary_items')
            .select('*')
            .eq('trip_id', tripId)
            .order('day_number');

        if (error && error.code === '42P01') return [];
        if (error) throw error;
        return data as ItineraryItem[];
    },
    enabled: !!tripId
});

export const useUpdateItinerary = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ tripId, items }: { tripId: string, items: any[] }) => {
            await supabase.from('itinerary_items').delete().eq('trip_id', tripId);

            if (items.length > 0) {
                const itemsToInsert = items.map(item => ({
                    trip_id: tripId,
                    day_number: item.day_number,
                    title: item.title,
                    description: item.description,
                    icon: item.icon,
                    image_url: item.image_url,
                    gradient: item.gradient
                }));

                const { error } = await (supabase as any).from('itinerary_items').insert(itemsToInsert);
                if (error) throw error;
            }
        },
        onSuccess: (_, variables) => qc.invalidateQueries({ queryKey: ['trip-itinerary', variables.tripId] })
    });
};

export const useTripImages = (tripId: string) => useQuery({
    queryKey: ['trip-images', tripId],
    queryFn: async () => {
        const { data, error } = await supabase
            .from('trip_images')
            .select('*')
            .eq('trip_id', tripId)
            .order('display_order');
        if (error && error.code === '42P01') return [];
        if (error) throw error;
        return data as TripImage[];
    },
    enabled: !!tripId
});

export const useUpdateTripImages = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ tripId, images }: { tripId: string, images: any[] }) => {
            await supabase.from('trip_images').delete().eq('trip_id', tripId);

            if (images.length > 0) {
                const items = images.map((img, idx) => ({
                    trip_id: tripId,
                    url: img.url,
                    is_featured: img.is_featured,
                    display_order: idx
                }));

                const { error } = await (supabase as any).from('trip_images').insert(items);
                if (error) throw error;
            }
        },
        onSuccess: (_, variables) => qc.invalidateQueries({ queryKey: ['trip-images', variables.tripId] })
    });
};

export const useTripDates = (tripId: string) => useQuery({
    queryKey: ['trip-dates', tripId],
    queryFn: async () => {
        const { data, error } = await supabase
            .from('trip_dates')
            .select('*')
            .eq('trip_id', tripId)
            .order('start_date');
        if (error && error.code === '42P01') return [];
        if (error) throw error;

        // Parse dates to JS Date objects for easier handling
        return (data as any[]).map(d => ({
            ...d,
            start_date: new Date(d.start_date),
            end_date: d.end_date ? new Date(d.end_date) : undefined
        })) as unknown as TripDate[];
    },
    enabled: !!tripId
});

export const useUpdateTripDates = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ tripId, dates }: { tripId: string, dates: any[] }) => {
            await supabase.from('trip_dates').delete().eq('trip_id', tripId);

            if (dates.length > 0) {
                const items = dates.map(d => ({
                    trip_id: tripId,
                    start_date: d.start_date instanceof Date ? d.start_date.toISOString().split('T')[0] : d.start_date,
                    end_date: d.end_date instanceof Date ? d.end_date.toISOString().split('T')[0] : d.end_date,
                    spots_total: d.spots_total,
                    spots_booked: d.spots_booked,
                    price_modifier: d.price_modifier,
                    status: d.status
                }));

                const { error } = await (supabase as any).from('trip_dates').insert(items);
                if (error) throw error;
            }
        },
        onSuccess: (_, variables) => qc.invalidateQueries({ queryKey: ['trip-dates', variables.tripId] })
    });
};

export const useTripPricing = (tripId: string) => useQuery({
    queryKey: ['trip-pricing', tripId],
    queryFn: async () => {
        const { data, error } = await supabase
            .from('trip_pricing')
            .select('*')
            .eq('trip_id', tripId);
        if (error && error.code === '42P01') return [];
        if (error) throw error;
        return data as PricingVariation[];
    },
    enabled: !!tripId
});

export const useUpdateTripPricing = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ tripId, variations }: { tripId: string, variations: any[] }) => {
            await supabase.from('trip_pricing').delete().eq('trip_id', tripId);

            if (variations.length > 0) {
                const items = variations.map(v => ({
                    trip_id: tripId,
                    type: v.type,
                    name: v.name,
                    amount: v.amount,
                    is_percentage: v.is_percentage,
                    conditions: v.conditions,
                    is_active: v.is_active
                }));

                const { error } = await (supabase as any).from('trip_pricing').insert(items);
                if (error) throw error;
            }
        },
        onSuccess: (_, variables) => qc.invalidateQueries({ queryKey: ['trip-pricing', variables.tripId] })
    });
};
