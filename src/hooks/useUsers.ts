import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  travel_preferences: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  roles?: string[];
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<UserProfile[]> => {
      const { data: profiles, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (!profiles) return [];
      const { data: roles } = await (supabase as any).from('user_roles').select('user_id, role');
      const rolesData = roles || [];
      return profiles.map((p: any) => ({ ...p, roles: rolesData.filter((r: any) => r.user_id === p.id).map((r: any) => r.role) }));
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role, action }: { userId: string; role: string; action: 'add' | 'remove' }) => {
      if (action === 'add') {
        const { error } = await (supabase as any).from('user_roles').insert({ user_id: userId, role });
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from('user_roles').delete().eq('user_id', userId).eq('role', role);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};
