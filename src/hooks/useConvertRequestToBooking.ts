import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ConvertToBookingParams {
  requestId: string;
  requestType: 'surprise' | 'custom' | 'reservation';
  tripId: string;
  userId: string;
  numTravelers?: number;
}

/**
 * Hook for admin to convert a request into a confirmed booking
 * This assigns a trip to a request and creates a booking entry
 */
export const useConvertRequestToBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      requestType,
      tripId,
      userId,
      numTravelers = 1,
    }: ConvertToBookingParams) => {
      // 1. Get trip details for pricing
      const { data: tripData, error: tripError } = await (supabase as any)
        .from('trips')
        .select('price, title')
        .eq('id', tripId)
        .single();

      if (tripError || !tripData) throw new Error('Failed to fetch trip details');

      const tripPrice = (tripData.price as number) ?? 0;
      const tripTitle = tripData.title as string;

      // 2. Create booking entry
      const { data: booking, error: bookingError } = await (supabase as any)
        .from('bookings')
        .insert({
          user_id: userId,
          trip_id: tripId,
          status: 'confirmed',
          num_travelers: numTravelers,
          total_amount: tripPrice * numTravelers,
          payment_status: 'pending',
          notes: `Converted from ${requestType} request`,
        })
        .select()
        .single();

      if (bookingError) throw new Error('Failed to create booking');

      // 3. Update the request status based on type
      let updateError;
      
      switch (requestType) {
        case 'surprise':
          const { error: surpriseError } = await (supabase as any)
            .from('surprise_requests')
            .update({ 
              status: 'confirmed',
              assigned_trip_id: tripId,
            })
            .eq('id', requestId);
          updateError = surpriseError;
          break;

        case 'custom':
          const { error: customError } = await (supabase as any)
            .from('custom_trip_requests')
            .update({ 
              status: 'confirmed',
              assigned_trip_id: tripId,
            })
            .eq('id', requestId);
          updateError = customError;
          break;

        case 'reservation':
          const { error: reservationError } = await (supabase as any)
            .from('trip_reservations')
            .update({ status: 'confirmed' })
            .eq('id', requestId);
          updateError = reservationError;
          break;
      }

      if (updateError) throw new Error('Failed to update request status');

      return { booking, tripTitle };
    },
    onSuccess: (data) => {
      toast({
        title: 'Booking Created!',
        description: `Successfully created booking for ${data.tripTitle}`,
      });
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['surprise-requests'] });
      queryClient.invalidateQueries({ queryKey: ['custom-requests'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for admin to assign a buddy to a surprise request
 */
export const useAssignBuddy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, buddyId }: { requestId: string; buddyId: string }) => {
      const { error } = await (supabase as any)
        .from('surprise_requests')
        .update({ 
          matched_buddy_id: buddyId,
          status: 'matched',
        })
        .eq('id', requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Buddy Assigned!',
        description: 'Local buddy has been matched to this request.',
      });
      queryClient.invalidateQueries({ queryKey: ['surprise-requests'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for admin to update request status
 */
export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      requestType,
      status,
      adminNotes,
    }: {
      requestId: string;
      requestType: 'surprise' | 'custom' | 'reservation';
      status: string;
      adminNotes?: string;
    }) => {
      const tableName = {
        surprise: 'surprise_requests',
        custom: 'custom_trip_requests',
        reservation: 'trip_reservations',
      }[requestType];

      const updateData: any = { status };
      if (adminNotes && requestType !== 'reservation') {
        updateData.admin_notes = adminNotes;
      }

      const { error } = await (supabase as any)
        .from(tableName)
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Status Updated',
        description: 'Request status has been updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['surprise-requests'] });
      queryClient.invalidateQueries({ queryKey: ['custom-requests'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export default useConvertRequestToBooking;
