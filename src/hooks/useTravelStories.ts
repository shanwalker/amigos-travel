import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TravelStory } from '@/integrations/supabase/database.types';

export type { TravelStory };

export const useTravelStories = () => {
  return useQuery({
    queryKey: ['travel-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travel_stories')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data as TravelStory[];
    },
  });
};

export const useFeaturedStories = () => {
  return useQuery({
    queryKey: ['featured-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travel_stories')
        .select('*')
        .eq('featured', true)
        .order('published_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data as TravelStory[];
    },
  });
};
