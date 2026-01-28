import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserSurpriseRequests,
  getSurpriseRequest,
  createSurpriseRequest,
  type SurpriseRequest,
} from '@/lib/supabase/surprise-requests';
import { useToast } from './use-toast';

export function useUserSurpriseRequests() {
  return useQuery({
    queryKey: ['surprise-requests', 'user'],
    queryFn: getUserSurpriseRequests,
  });
}

export function useSurpriseRequest(id: string) {
  return useQuery({
    queryKey: ['surprise-requests', id],
    queryFn: () => getSurpriseRequest(id),
    enabled: !!id,
  });
}

export function useCreateSurpriseRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createSurpriseRequest,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['surprise-requests'] });
      toast({
        title: 'Surprise Trip Requested! 🎁',
        description: `Your request reference is ${result.request?.request_reference}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Request Failed',
        description: error.message || 'Failed to submit surprise request',
        variant: 'destructive',
      });
    },
  });
}
