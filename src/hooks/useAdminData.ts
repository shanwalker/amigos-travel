import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllBookings,
    getBookingStats,
    updateBookingStatus,
    updatePaymentStatus,
    exportBookingsToCSV,
    type Booking,
} from '@/lib/supabase/bookings';
import {
    getAllCustomRequests,
    getCustomRequestStats,
    updateCustomRequestStatus,
    assignCustomRequest,
    addAdminNotes,
    exportCustomRequestsToCSV,
    type CustomRequest,
} from '@/lib/supabase/custom-requests';
import {
    getAllSurpriseRequests,
    getSurpriseRequestStats,
    updateSurpriseRequestStatus,
    assignSurpriseDestination,
    updateSurpriseClue,
    markClueAsSent,
    getCluesDueToSend,
    exportSurpriseRequestsToCSV,
    type SurpriseRequest,
} from '@/lib/supabase/surprise-requests';
import {
    getMostWishlistedTrips,
    getWishlistStats,
} from '@/lib/supabase/wishlist';
import { useToast } from './use-toast';

// Booking Admin Hooks
export function useAllBookings(filters?: {
    status?: Booking['status'];
    paymentStatus?: Booking['payment_status'];
    startDate?: string;
    endDate?: string;
    limit?: number;
}) {
    return useQuery({
        queryKey: ['admin', 'bookings', filters],
        queryFn: () => getAllBookings(filters),
    });
}

export function useBookingStats() {
    return useQuery({
        queryKey: ['admin', 'bookings', 'stats'],
        queryFn: getBookingStats,
    });
}

export function useAdminUpdateBookingStatus() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, status, reason }: { id: string; status: Booking['status']; reason?: string }) =>
            updateBookingStatus(id, status, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
            toast({
                title: 'Booking Updated',
                description: 'Booking status has been updated successfully',
            });
        },
    });
}

export function useAdminUpdatePaymentStatus() {
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
            queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
        },
    });
}

// Custom Request Admin Hooks
export function useAllCustomRequests(filters?: {
    status?: CustomRequest['status'];
    priority?: CustomRequest['priority'];
    assignedTo?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
}) {
    return useQuery({
        queryKey: ['admin', 'custom-requests', filters],
        queryFn: () => getAllCustomRequests(filters),
    });
}

export function useCustomRequestStats() {
    return useQuery({
        queryKey: ['admin', 'custom-requests', 'stats'],
        queryFn: getCustomRequestStats,
    });
}

export function useAdminUpdateCustomRequestStatus() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, status, response, cost }: {
            id: string;
            status: CustomRequest['status'];
            response?: string;
            cost?: number;
        }) => updateCustomRequestStatus(id, status, response, cost),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'custom-requests'] });
            toast({
                title: 'Request Updated',
                description: 'Custom request status has been updated',
            });
        },
    });
}

export function useAssignCustomRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, adminId }: { id: string; adminId: string }) =>
            assignCustomRequest(id, adminId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'custom-requests'] });
        },
    });
}

export function useAddAdminNotes() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, notes }: { id: string; notes: string }) =>
            addAdminNotes(id, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'custom-requests'] });
        },
    });
}

// Surprise Request Admin Hooks
export function useAllSurpriseRequests(filters?: {
    status?: SurpriseRequest['status'];
    startDate?: string;
    endDate?: string;
    limit?: number;
}) {
    return useQuery({
        queryKey: ['admin', 'surprise-requests', filters],
        queryFn: () => getAllSurpriseRequests(filters),
    });
}

export function useSurpriseRequestStats() {
    return useQuery({
        queryKey: ['admin', 'surprise-requests', 'stats'],
        queryFn: getSurpriseRequestStats,
    });
}

export function useAdminUpdateSurpriseRequestStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: SurpriseRequest['status'] }) =>
            updateSurpriseRequestStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'surprise-requests'] });
        },
    });
}

export function useAssignSurpriseDestination() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, destination, revealDate }: { id: string; destination: string; revealDate: string }) =>
            assignSurpriseDestination(id, destination, revealDate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'surprise-requests'] });
            toast({
                title: 'Destination Assigned',
                description: 'Surprise destination has been assigned successfully',
            });
        },
    });
}

export function useUpdateSurpriseClue() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, week, clue, markSent }: { id: string; week: number; clue: string; markSent?: boolean }) =>
            updateSurpriseClue(id, week, clue, markSent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'surprise-requests'] });
        },
    });
}

export function useMarkClueAsSent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, week }: { id: string; week: number }) =>
            markClueAsSent(id, week),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'surprise-requests'] });
        },
    });
}

export function useCluesDueToSend() {
    return useQuery({
        queryKey: ['admin', 'surprise-requests', 'clues-due'],
        queryFn: getCluesDueToSend,
        refetchInterval: 60000, // Refetch every minute
    });
}

// Wishlist Admin Hooks
export function useMostWishlistedTrips(limit: number = 10) {
    return useQuery({
        queryKey: ['admin', 'wishlist', 'most-wishlisted', limit],
        queryFn: () => getMostWishlistedTrips(limit),
    });
}

export function useWishlistStats() {
    return useQuery({
        queryKey: ['admin', 'wishlist', 'stats'],
        queryFn: getWishlistStats,
    });
}
