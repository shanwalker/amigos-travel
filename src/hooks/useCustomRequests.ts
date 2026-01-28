import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserCustomRequests,
  getCustomRequest,
  createCustomRequest,
  updateCustomRequestStatus,
  type CustomRequest,
} from '@/lib/supabase/custom-requests';
import { useToast } from './use-toast';

export function useUserCustomRequests() {
  return useQuery({
    queryKey: ['custom-requests', 'user'],
    queryFn: getUserCustomRequests,
  });
}

export function useCustomRequest(id: string) {
  return useQuery({
    queryKey: ['custom-requests', id],
    queryFn: () => getCustomRequest(id),
    enabled: !!id,
  });
}

export function useCreateCustomRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createCustomRequest,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['custom-requests'] });
      toast({
        title: 'Request Submitted!',
        description: `Your request reference is ${result.request?.request_reference}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Request Failed',
        description: error.message || 'Failed to submit request',
        variant: 'destructive',
      });
    },
  });
}
