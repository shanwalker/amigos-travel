import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getUserWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    updateWishlistNotes,
    updateWishlistPriority,
    getWishlistCount,
    clearWishlist,
} from '@/lib/supabase/wishlist';
import { useToast } from './use-toast';

export function useWishlist() {
    return useQuery({
        queryKey: ['wishlist'],
        queryFn: getUserWishlist,
    });
}

export function useWishlistCount() {
    return useQuery({
        queryKey: ['wishlist', 'count'],
        queryFn: getWishlistCount,
    });
}

export function useIsInWishlist(tripId: string) {
    return useQuery({
        queryKey: ['wishlist', 'check', tripId],
        queryFn: () => isInWishlist(tripId),
        enabled: !!tripId,
    });
}

export function useAddToWishlist() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ tripId, notes, priority }: { tripId: string; notes?: string; priority?: 'low' | 'medium' | 'high' }) =>
            addToWishlist(tripId, notes, priority),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast({
                title: 'Added to Wishlist',
                description: 'Trip has been added to your wishlist',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to add to wishlist',
                variant: 'destructive',
            });
        },
    });
}

export function useRemoveFromWishlist() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: removeFromWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast({
                title: 'Removed from Wishlist',
                description: 'Trip has been removed from your wishlist',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to remove from wishlist',
                variant: 'destructive',
            });
        },
    });
}

export function useToggleWishlist() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: toggleWishlist,
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast({
                title: result.added ? 'Added to Wishlist' : 'Removed from Wishlist',
                description: result.added
                    ? 'Trip has been added to your wishlist'
                    : 'Trip has been removed from your wishlist',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update wishlist',
                variant: 'destructive',
            });
        },
    });
}

export function useUpdateWishlistNotes() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ tripId, notes }: { tripId: string; notes: string }) =>
            updateWishlistNotes(tripId, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast({
                title: 'Notes Updated',
                description: 'Wishlist notes have been updated',
            });
        },
    });
}

export function useUpdateWishlistPriority() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tripId, priority }: { tripId: string; priority: 'low' | 'medium' | 'high' }) =>
            updateWishlistPriority(tripId, priority),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });
}

export function useClearWishlist() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: clearWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast({
                title: 'Wishlist Cleared',
                description: 'All items have been removed from your wishlist',
            });
        },
    });
}
