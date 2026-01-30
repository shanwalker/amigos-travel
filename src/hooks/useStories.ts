import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    cover_image: string | null;
    category: string | null;
    tags: string[] | null;
    status: 'draft' | 'published' | 'scheduled';
    published_at: string | null;
    created_at: string;
    views?: number;
}

export const useStories = () => {
    return useQuery({
        queryKey: ['stories'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                if (error.code === '42P01') return [];
                throw error;
            }
            return data as BlogPost[];
        },
    });
};

export const useCreateStory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (story: Partial<BlogPost>) => {
            const { error } = await (supabase as any)
                .from('blog_posts')
                .insert([story]);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stories'] }),
    });
};

export const useUpdateStory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<BlogPost> & { id: string }) => {
            const { error } = await (supabase as any)
                .from('blog_posts')
                .update(updates)
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stories'] }),
    });
};

export const useDeleteStory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('blog_posts')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stories'] }),
    });
};
