import { supabase } from '@/integrations/supabase/client';

export interface WishlistItem {
    id?: string;
    user_id: string;
    trip_id: string;
    notes?: string;
    priority?: 'low' | 'medium' | 'high';
    created_at?: string;
    updated_at?: string;
}

export interface WishlistItemWithTrip extends WishlistItem {
    trip?: any;
}

/**
 * Add trip to wishlist
 */
export async function addToWishlist(tripId: string, notes?: string, priority?: 'low' | 'medium' | 'high'): Promise<{ success: boolean; item?: WishlistItem; error?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        // Check if already in wishlist
        const { data: existing } = await supabase
            .from('wishlists')
            .select('*')
            .eq('user_id', user.id)
            .eq('trip_id', tripId)
            .single();

        if (existing) {
            return { success: false, error: 'Trip already in wishlist' };
        }

        const wishlistItem: Partial<WishlistItem> = {
            user_id: user.id,
            trip_id: tripId,
            notes,
            priority: priority || 'medium',
        };

        const { data, error } = await supabase
            .from('wishlists')
            .insert([wishlistItem])
            .select()
            .single();

        if (error) {
            console.error('Error adding to wishlist:', error);
            return { success: false, error: error.message };
        }

        return { success: true, item: data as WishlistItem };
    } catch (error: any) {
        console.error('Error in addToWishlist:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Remove trip from wishlist
 */
export async function removeFromWishlist(tripId: string): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('trip_id', tripId);

        if (error) {
            console.error('Error removing from wishlist:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in removeFromWishlist:', error);
        return false;
    }
}

/**
 * Check if trip is in wishlist
 */
export async function isInWishlist(tripId: string): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data, error } = await supabase
            .from('wishlists')
            .select('id')
            .eq('user_id', user.id)
            .eq('trip_id', tripId)
            .single();

        if (error) return false;
        return !!data;
    } catch (error) {
        return false;
    }
}

/**
 * Get user's wishlist
 */
export async function getUserWishlist(): Promise<WishlistItemWithTrip[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('wishlists')
            .select(`
        *,
        trip:trips(*)
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching wishlist:', error);
            return [];
        }

        return data as WishlistItemWithTrip[];
    } catch (error) {
        console.error('Error in getUserWishlist:', error);
        return [];
    }
}

/**
 * Update wishlist item notes
 */
export async function updateWishlistNotes(tripId: string, notes: string): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase
            .from('wishlists')
            .update({
                notes,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)
            .eq('trip_id', tripId);

        if (error) {
            console.error('Error updating wishlist notes:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in updateWishlistNotes:', error);
        return false;
    }
}

/**
 * Update wishlist item priority
 */
export async function updateWishlistPriority(tripId: string, priority: 'low' | 'medium' | 'high'): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase
            .from('wishlists')
            .update({
                priority,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)
            .eq('trip_id', tripId);

        if (error) {
            console.error('Error updating wishlist priority:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in updateWishlistPriority:', error);
        return false;
    }
}

/**
 * Get wishlist count for user
 */
export async function getWishlistCount(): Promise<number> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return 0;

        const { count, error } = await supabase
            .from('wishlists')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        if (error) {
            console.error('Error getting wishlist count:', error);
            return 0;
        }

        return count || 0;
    } catch (error) {
        console.error('Error in getWishlistCount:', error);
        return 0;
    }
}

/**
 * Get most wishlisted trips (admin analytics)
 */
export async function getMostWishlistedTrips(limit: number = 10): Promise<Array<{
    tripId: string;
    tripName: string;
    wishlistCount: number;
}>> {
    try {
        const { data: wishlists, error } = await supabase
            .from('wishlists')
            .select(`
        trip_id,
        trip:trips(name)
      `);

        if (error || !wishlists) {
            console.error('Error fetching wishlisted trips:', error);
            return [];
        }

        // Count occurrences of each trip
        const tripCounts: { [key: string]: { name: string; count: number } } = {};
        wishlists.forEach((item: any) => {
            const tripId = item.trip_id;
            const tripName = item.trip?.name || 'Unknown Trip';

            if (!tripCounts[tripId]) {
                tripCounts[tripId] = { name: tripName, count: 0 };
            }
            tripCounts[tripId].count++;
        });

        // Convert to array and sort
        const sortedTrips = Object.entries(tripCounts)
            .map(([tripId, data]) => ({
                tripId,
                tripName: data.name,
                wishlistCount: data.count,
            }))
            .sort((a, b) => b.wishlistCount - a.wishlistCount)
            .slice(0, limit);

        return sortedTrips;
    } catch (error) {
        console.error('Error in getMostWishlistedTrips:', error);
        return [];
    }
}

/**
 * Get wishlist statistics (admin)
 */
export async function getWishlistStats(): Promise<{
    totalWishlists: number;
    totalUsers: number;
    averageWishlistSize: number;
    mostWishlistedTrips: Array<{ tripId: string; tripName: string; count: number }>;
}> {
    try {
        const { data: wishlists, error } = await supabase
            .from('wishlists')
            .select('*');

        if (error || !wishlists) {
            return {
                totalWishlists: 0,
                totalUsers: 0,
                averageWishlistSize: 0,
                mostWishlistedTrips: [],
            };
        }

        // Count unique users
        const uniqueUsers = new Set(wishlists.map(w => w.user_id));
        const totalUsers = uniqueUsers.size;

        // Calculate average wishlist size
        const averageWishlistSize = totalUsers > 0 ? wishlists.length / totalUsers : 0;

        // Get most wishlisted trips
        const mostWishlisted = await getMostWishlistedTrips(5);

        return {
            totalWishlists: wishlists.length,
            totalUsers,
            averageWishlistSize: Math.round(averageWishlistSize * 10) / 10,
            mostWishlistedTrips: mostWishlisted,
        };
    } catch (error) {
        console.error('Error in getWishlistStats:', error);
        return {
            totalWishlists: 0,
            totalUsers: 0,
            averageWishlistSize: 0,
            mostWishlistedTrips: [],
        };
    }
}

/**
 * Clear entire wishlist
 */
export async function clearWishlist(): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id);

        if (error) {
            console.error('Error clearing wishlist:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in clearWishlist:', error);
        return false;
    }
}

/**
 * Toggle wishlist (add if not present, remove if present)
 */
export async function toggleWishlist(tripId: string): Promise<{ success: boolean; added: boolean; error?: string }> {
    try {
        const inWishlist = await isInWishlist(tripId);

        if (inWishlist) {
            const removed = await removeFromWishlist(tripId);
            return { success: removed, added: false };
        } else {
            const result = await addToWishlist(tripId);
            return { success: result.success, added: true, error: result.error };
        }
    } catch (error: any) {
        console.error('Error in toggleWishlist:', error);
        return { success: false, added: false, error: error.message };
    }
}
