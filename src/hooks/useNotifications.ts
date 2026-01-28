import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    subscribeToNotifications,
    type Notification,
} from '@/lib/supabase/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useToast } from './use-toast';

export function useNotifications(unreadOnly: boolean = false) {
    return useQuery({
        queryKey: ['notifications', unreadOnly],
        queryFn: () => getUserNotifications(unreadOnly),
    });
}

export function useUnreadCount() {
    return useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: getUnreadCount,
        refetchInterval: 30000, // Refetch every 30 seconds
    });
}

export function useMarkAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

export function useMarkAllAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

export function useDeleteNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

export function useDeleteAllRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAllRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

/**
 * Subscribe to real-time notifications
 */
export function useRealtimeNotifications() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    useEffect(() => {
        if (!user?.id) return;

        const unsubscribe = subscribeToNotifications(user.id, (notification: Notification) => {
            // Invalidate queries to refetch
            queryClient.invalidateQueries({ queryKey: ['notifications'] });

            // Show toast notification
            toast({
                title: notification.title,
                description: notification.message,
            });
        });

        return () => {
            unsubscribe();
        };
    }, [user?.id, queryClient, toast]);
}
