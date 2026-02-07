import { supabase } from '@/integrations/supabase/client';

export const uploadProposalImage = async (
    file: File,
    folder: 'hero' | 'experiences' | 'destination' = 'hero'
): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from('proposal-images')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('proposal-images')
        .getPublicUrl(data.path);

    return publicUrl;
};

export const deleteProposalImage = async (url: string): Promise<void> => {
    const path = url.split('/proposal-images/')[1];
    if (!path) return;

    const { error } = await supabase.storage
        .from('proposal-images')
        .remove([path]);

    if (error) throw error;
};
