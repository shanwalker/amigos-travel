import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to subscribe to real-time updates for user requests
 * User dashboard updates when admin changes request status
 */
export const useRealtimeUserRequests = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    // Subscribe to surprise_requests changes
    const surpriseChannel = supabase
      .channel('user-surprise-requests')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'surprise_requests',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['surprise-requests'] });
          
          const newStatus = payload.new?.status;
          if (newStatus === 'matched') {
            toast({
              title: '🎉 Buddy Matched!',
              description: 'A local buddy has been assigned to your surprise trip!',
            });
          } else if (newStatus === 'confirmed') {
            toast({
              title: '✈️ Trip Confirmed!',
              description: 'Your surprise trip has been confirmed. Check your bookings!',
            });
          }
        }
      )
      .subscribe();

    // Subscribe to custom_trip_requests changes
    const customChannel = supabase
      .channel('user-custom-requests')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'custom_trip_requests',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['custom-requests'] });
          
          const newStatus = payload.new?.status;
          if (newStatus === 'planning') {
            toast({
              title: '📝 Planning Started!',
              description: 'Our team has started planning your custom trip!',
            });
          } else if (newStatus === 'confirmed') {
            toast({
              title: '✈️ Trip Ready!',
              description: 'Your custom trip is ready. Check your bookings!',
            });
          }
        }
      )
      .subscribe();

    // Subscribe to trip_reservations changes
    const reservationChannel = supabase
      .channel('user-reservations')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trip_reservations',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['reservations'] });
          
          const newStatus = payload.new?.status;
          if (newStatus === 'confirmed') {
            toast({
              title: '🎊 Reservation Confirmed!',
              description: 'Your group trip reservation is confirmed!',
            });
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(surpriseChannel);
      supabase.removeChannel(customChannel);
      supabase.removeChannel(reservationChannel);
    };
  }, [userId, queryClient]);
};

/**
 * Hook for admin to subscribe to real-time updates for all requests
 * Admin sees new requests immediately
 */
export const useRealtimeAdminRequests = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to all surprise_requests changes
    const surpriseChannel = supabase
      .channel('admin-surprise-requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'surprise_requests',
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['surprise-requests'] });
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: '🆕 New Surprise Request',
              description: 'A new surprise trip request has been submitted.',
            });
          }
        }
      )
      .subscribe();

    // Subscribe to all custom_trip_requests changes
    const customChannel = supabase
      .channel('admin-custom-requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'custom_trip_requests',
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['custom-requests'] });
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: '🆕 New Custom Request',
              description: 'A new custom trip request has been submitted.',
            });
          }
        }
      )
      .subscribe();

    // Subscribe to all trip_reservations changes
    const reservationChannel = supabase
      .channel('admin-reservations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trip_reservations',
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['reservations'] });
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: '🆕 New Group Reservation',
              description: 'A new group trip reservation has been made.',
            });
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(surpriseChannel);
      supabase.removeChannel(customChannel);
      supabase.removeChannel(reservationChannel);
    };
  }, [queryClient]);
};

export default useRealtimeUserRequests;
