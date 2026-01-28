import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  updatePaymentStatus,
  cancelBooking,
  confirmBooking,
  completeBooking,
  type Booking,
} from '@/lib/supabase/bookings';
import { useToast } from './use-toast';

export function useUserBookings() {
  return useQuery({
    queryKey: ['bookings', 'user'],
    queryFn: getUserBookings,
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => getBooking(id),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Booking Created!',
        description: `Your booking reference is ${result.booking?.booking_reference}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Booking Failed',
        description: error.message || 'Failed to create booking',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: Booking['status']; reason?: string }) =>
      updateBookingStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Booking Updated',
        description: 'Booking status has been updated',
      });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been cancelled',
      });
    },
  });
}

export function useConfirmBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, amount, paymentId, method }: {
      id: string;
      status: Booking['payment_status'];
      amount?: number;
      paymentId?: string;
      method?: string;
    }) => updatePaymentStatus(id, status, amount, paymentId, method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
