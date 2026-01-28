import { supabase } from '@/integrations/supabase/client';

export interface Notification {
    id?: string;
    user_id: string;
    type: 'booking' | 'request' | 'surprise' | 'payment' | 'system' | 'admin';
    title: string;
    message: string;
    link?: string;
    read: boolean;
    priority?: 'low' | 'medium' | 'high';
    metadata?: any;
    created_at?: string;
    read_at?: string;
}

/**
 * Create notification
 */
export async function createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    link?: string,
    priority?: Notification['priority'],
    metadata?: any
): Promise<{ success: boolean; notification?: Notification; error?: string }> {
    try {
        const notification: Partial<Notification> = {
            user_id: userId,
            type,
            title,
            message,
            link,
            priority: priority || 'medium',
            read: false,
            metadata,
        };

        const { data, error } = await (supabase
            .from('notifications') as any)
            .insert([notification])
            .select()
            .single();

        if (error) {
            console.error('Error creating notification:', error);
            return { success: false, error: error.message };
        }

        return { success: true, notification: data as Notification };
    } catch (error: any) {
        console.error('Error in createNotification:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get user notifications
 */
export async function getUserNotifications(unreadOnly: boolean = false): Promise<Notification[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        let query = supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (unreadOnly) {
            query = query.eq('read', false);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }

        return data as Notification[];
    } catch (error) {
        console.error('Error in getUserNotifications:', error);
        return [];
    }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<number> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return 0;

        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('read', false);

        if (error) {
            console.error('Error getting unread count:', error);
            return 0;
        }

        return count || 0;
    } catch (error) {
        console.error('Error in getUnreadCount:', error);
        return 0;
    }
}

/**
 * Mark notification as read
 */
export async function markAsRead(id: string): Promise<boolean> {
    try {
        const { error } = await (supabase
            .from('notifications') as any)
            .update({
                read: true,
                read_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) {
            console.error('Error marking notification as read:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in markAsRead:', error);
        return false;
    }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await (supabase
            .from('notifications') as any)
            .update({
                read: true,
                read_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)
            .eq('read', false);

        if (error) {
            console.error('Error marking all as read:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in markAllAsRead:', error);
        return false;
    }
}

/**
 * Delete notification
 */
export async function deleteNotification(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting notification:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in deleteNotification:', error);
        return false;
    }
}

/**
 * Delete all read notifications
 */
export async function deleteAllRead(): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('user_id', user.id)
            .eq('read', true);

        if (error) {
            console.error('Error deleting read notifications:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in deleteAllRead:', error);
        return false;
    }
}

/**
 * Subscribe to real-time notifications
 */
export function subscribeToNotifications(
    userId: string,
    callback: (notification: Notification) => void
): () => void {
    const channel = supabase
        .channel('notifications')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`,
            },
            (payload) => {
                callback(payload.new as Notification);
            }
        )
        .subscribe();

    // Return unsubscribe function
    return () => {
        supabase.removeChannel(channel);
    };
}

/**
 * Notification helpers for common scenarios
 */

export async function notifyBookingConfirmed(userId: string, bookingRef: string, tripName: string): Promise<void> {
    await createNotification(
        userId,
        'booking',
        'Booking Confirmed! 🎉',
        `Your booking for ${tripName} (${bookingRef}) has been confirmed!`,
        `/dashboard/bookings`,
        'high'
    );
}

export async function notifyPaymentReceived(userId: string, amount: number, bookingRef: string): Promise<void> {
    await createNotification(
        userId,
        'payment',
        'Payment Received',
        `We've received your payment of ₹${amount.toLocaleString()} for booking ${bookingRef}`,
        `/dashboard/bookings`,
        'medium'
    );
}

export async function notifyRequestUpdated(userId: string, requestRef: string, status: string): Promise<void> {
    await createNotification(
        userId,
        'request',
        'Request Updated',
        `Your custom request ${requestRef} status has been updated to: ${status}`,
        `/dashboard/requests`,
        'medium'
    );
}

export async function notifySurpriseClue(userId: string, week: number, clue: string): Promise<void> {
    await createNotification(
        userId,
        'surprise',
        `Week ${week} Clue! 🎁`,
        clue,
        `/dashboard/surprise`,
        'high'
    );
}

export async function notifySurpriseRevealed(userId: string, destination: string): Promise<void> {
    await createNotification(
        userId,
        'surprise',
        'Surprise Revealed! 🌍',
        `Your surprise destination is... ${destination}!`,
        `/dashboard/surprise`,
        'high'
    );
}

export async function notifyAdminMessage(userId: string, message: string): Promise<void> {
    await createNotification(
        userId,
        'admin',
        'Message from Travel Amigo',
        message,
        undefined,
        'high'
    );
}
