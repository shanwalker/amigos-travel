import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Booking {
  id: string;
  trip_id: string;
  user_id: string | null;
  trip_date_id: string | null;
  guest_count: number;
  total_amount: number;
  amount_paid: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded' | 'failed';
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  special_requests?: string;
  internal_notes?: string;
  created_at: string;
  trip?: {
    title: string;
    destination: string;
  };
  trip_date?: {
    start_date: string;
    end_date: string;
  };
}

export interface PaymentTransaction {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  method: string;
  transaction_id?: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  payment_date: string;
}

// --- Hooks ---

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          trip:trips(title, destination),
          trip_date:trip_dates(start_date, end_date)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          console.warn('Bookings table not found. Please run the migration.');
          return [];
        }
        throw error;
      }
      return data as Booking[];
    },
  });
};

// Alias for admin usage
export const useAllBookings = useBookings;

// Get bookings for current user
export const useUserBookings = () => {
  return useQuery({
    queryKey: ['user-bookings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          trip:trips(title, destination, image_url, start_date),
          trip_date:trip_dates(start_date, end_date)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return data as Booking[];
    },
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
                    *,
                    trip:trips(title, destination, image_url),
                    trip_date:trip_dates(start_date, end_date)
                `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Booking;
    },
    enabled: !!id,
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Booking> }) => {
      const { error } = await (supabase as any)
        .from('bookings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Success', description: 'Booking updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Success', description: 'Booking deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (booking: {
      trip_id: string;
      number_of_travelers: number;
      total_amount: number;
      special_requests?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await (supabase as any)
        .from('bookings')
        .insert({
          trip_id: booking.trip_id,
          user_id: user.id,
          guest_count: booking.number_of_travelers,
          total_amount: booking.total_amount,
          special_requests: booking.special_requests,
          status: 'pending',
          payment_status: 'pending',
          amount_paid: 0,
          currency: 'INR',
          customer_name: user.email?.split('@')[0] || 'Guest',
          customer_email: user.email || '',
          customer_phone: '',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      toast({ title: 'Success', description: 'Booking created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const { error } = await (supabase as any)
        .from('bookings')
        .update({ 
          status: 'cancelled',
          internal_notes: reason || 'User cancelled'
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      toast({ title: 'Booking Cancelled', description: 'Your booking has been cancelled' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

// --- Payments ---

export const useBookingPayments = (bookingId: string) => {
  return useQuery({
    queryKey: ['payments', bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return data as PaymentTransaction[];
    },
    enabled: !!bookingId,
  });
};

export const useAddPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payment: Partial<PaymentTransaction>) => {
      const { error } = await (supabase as any)
        .from('payment_transactions')
        .insert([payment]);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments', variables.booking_id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] }); // Refresh booking for amount_paid
      queryClient.invalidateQueries({ queryKey: ['booking', variables.booking_id] });
      toast({ title: 'Success', description: 'Payment recorded' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};
