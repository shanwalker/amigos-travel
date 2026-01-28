import { supabase } from '@/integrations/supabase/client';

export interface Booking {
    id?: string;
    user_id: string;
    trip_id: string;
    booking_reference?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
    total_amount: number;
    paid_amount: number;
    currency: string;
    number_of_travelers: number;
    traveler_details?: any;
    special_requests?: string;
    booking_date: string;
    travel_start_date: string;
    travel_end_date: string;
    payment_method?: string;
    payment_id?: string;
    cancellation_reason?: string;
    cancelled_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface BookingWithTrip extends Booking {
    trip?: any;
    user?: any;
}

/**
 * Create a new booking
 */
export async function createBooking(bookingData: Partial<Booking>): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        // Generate booking reference
        const bookingReference = `TA${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        const booking: Partial<Booking> = {
            ...bookingData,
            user_id: user.id,
            booking_reference: bookingReference,
            status: 'pending',
            payment_status: 'pending',
            booking_date: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('bookings')
            .insert([booking])
            .select()
            .single();

        if (error) {
            console.error('Error creating booking:', error);
            return { success: false, error: error.message };
        }

        return { success: true, booking: data as Booking };
    } catch (error: any) {
        console.error('Error in createBooking:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get user's bookings
 */
export async function getUserBookings(): Promise<BookingWithTrip[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('bookings')
            .select(`
        *,
        trip:trips(*),
        user:profiles(*)
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user bookings:', error);
            return [];
        }

        return data as BookingWithTrip[];
    } catch (error) {
        console.error('Error in getUserBookings:', error);
        return [];
    }
}

/**
 * Get single booking by ID
 */
export async function getBooking(id: string): Promise<BookingWithTrip | null> {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
        *,
        trip:trips(*),
        user:profiles(*)
      `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching booking:', error);
            return null;
        }

        return data as BookingWithTrip;
    } catch (error) {
        console.error('Error in getBooking:', error);
        return null;
    }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
    id: string,
    status: Booking['status'],
    cancellationReason?: string
): Promise<boolean> {
    try {
        const updateData: any = {
            status,
            updated_at: new Date().toISOString(),
        };

        if (status === 'cancelled') {
            updateData.cancelled_at = new Date().toISOString();
            if (cancellationReason) {
                updateData.cancellation_reason = cancellationReason;
            }
        }

        const { error } = await supabase
            .from('bookings')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error('Error updating booking status:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in updateBookingStatus:', error);
        return false;
    }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
    id: string,
    paymentStatus: Booking['payment_status'],
    paidAmount?: number,
    paymentId?: string,
    paymentMethod?: string
): Promise<boolean> {
    try {
        const updateData: any = {
            payment_status: paymentStatus,
            updated_at: new Date().toISOString(),
        };

        if (paidAmount !== undefined) {
            updateData.paid_amount = paidAmount;
        }

        if (paymentId) {
            updateData.payment_id = paymentId;
        }

        if (paymentMethod) {
            updateData.payment_method = paymentMethod;
        }

        const { error } = await supabase
            .from('bookings')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error('Error updating payment status:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in updatePaymentStatus:', error);
        return false;
    }
}

/**
 * Get all bookings (admin only)
 */
export async function getAllBookings(filters?: {
    status?: Booking['status'];
    paymentStatus?: Booking['payment_status'];
    startDate?: string;
    endDate?: string;
    limit?: number;
}): Promise<BookingWithTrip[]> {
    try {
        let query = supabase
            .from('bookings')
            .select(`
        *,
        trip:trips(*),
        user:profiles(*)
      `)
            .order('created_at', { ascending: false });

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        if (filters?.paymentStatus) {
            query = query.eq('payment_status', filters.paymentStatus);
        }

        if (filters?.startDate) {
            query = query.gte('created_at', filters.startDate);
        }

        if (filters?.endDate) {
            query = query.lte('created_at', filters.endDate);
        }

        if (filters?.limit) {
            query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching all bookings:', error);
            return [];
        }

        return data as BookingWithTrip[];
    } catch (error) {
        console.error('Error in getAllBookings:', error);
        return [];
    }
}

/**
 * Get booking statistics (admin only)
 */
export async function getBookingStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
    totalRevenue: number;
    pendingPayments: number;
}> {
    try {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*');

        if (error || !bookings) {
            return {
                total: 0,
                pending: 0,
                confirmed: 0,
                cancelled: 0,
                completed: 0,
                totalRevenue: 0,
                pendingPayments: 0,
            };
        }

        const stats = {
            total: bookings.length,
            pending: bookings.filter(b => b.status === 'pending').length,
            confirmed: bookings.filter(b => b.status === 'confirmed').length,
            cancelled: bookings.filter(b => b.status === 'cancelled').length,
            completed: bookings.filter(b => b.status === 'completed').length,
            totalRevenue: bookings
                .filter(b => b.payment_status === 'paid')
                .reduce((sum, b) => sum + (b.total_amount || 0), 0),
            pendingPayments: bookings
                .filter(b => b.payment_status === 'pending' || b.payment_status === 'partial')
                .reduce((sum, b) => sum + ((b.total_amount || 0) - (b.paid_amount || 0)), 0),
        };

        return stats;
    } catch (error) {
        console.error('Error in getBookingStats:', error);
        return {
            total: 0,
            pending: 0,
            confirmed: 0,
            cancelled: 0,
            completed: 0,
            totalRevenue: 0,
            pendingPayments: 0,
        };
    }
}

/**
 * Cancel booking
 */
export async function cancelBooking(id: string, reason: string): Promise<boolean> {
    return updateBookingStatus(id, 'cancelled', reason);
}

/**
 * Confirm booking
 */
export async function confirmBooking(id: string): Promise<boolean> {
    return updateBookingStatus(id, 'confirmed');
}

/**
 * Complete booking
 */
export async function completeBooking(id: string): Promise<boolean> {
    return updateBookingStatus(id, 'completed');
}

/**
 * Export bookings to CSV (admin only)
 */
export async function exportBookingsToCSV(filters?: {
    status?: Booking['status'];
    startDate?: string;
    endDate?: string;
}): Promise<string> {
    try {
        const bookings = await getAllBookings(filters);

        const headers = [
            'Booking Reference',
            'User Email',
            'Trip Name',
            'Status',
            'Payment Status',
            'Total Amount',
            'Paid Amount',
            'Currency',
            'Travelers',
            'Travel Start',
            'Travel End',
            'Booking Date',
            'Payment Method',
        ];

        const rows = bookings.map(b => [
            b.booking_reference,
            b.user?.email || '',
            b.trip?.name || '',
            b.status,
            b.payment_status,
            b.total_amount,
            b.paid_amount,
            b.currency,
            b.number_of_travelers,
            b.travel_start_date,
            b.travel_end_date,
            b.booking_date,
            b.payment_method || '',
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
        ].join('\n');

        return csv;
    } catch (error) {
        console.error('Error in exportBookingsToCSV:', error);
        throw error;
    }
}
