import { supabase } from '@/integrations/supabase/client';

export interface CustomRequest {
    id?: string;
    user_id: string;
    request_reference?: string;
    status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'completed';
    destination?: string;
    travel_dates?: { start: string; end: string };
    duration?: string;
    budget_min?: number;
    budget_max?: number;
    number_of_travelers: number;
    traveler_types?: string[];
    interests?: string[];
    accommodation_preference?: string;
    special_requirements?: string;
    additional_notes?: string;
    admin_notes?: string;
    admin_response?: string;
    estimated_cost?: number;
    assigned_to?: string;
    priority?: 'low' | 'medium' | 'high';
    created_at?: string;
    updated_at?: string;
    reviewed_at?: string;
    completed_at?: string;
}

export interface CustomRequestWithUser extends CustomRequest {
    user?: any;
    assigned_admin?: any;
}

/**
 * Create custom trip request
 */
export async function createCustomRequest(requestData: Partial<CustomRequest>): Promise<{ success: boolean; request?: CustomRequest; error?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const requestReference = `CR${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        const request: Partial<CustomRequest> = {
            ...requestData,
            user_id: user.id,
            request_reference: requestReference,
            status: 'pending',
            priority: 'medium',
        };

        const { data, error } = await supabase
            .from('custom_requests')
            .insert([request])
            .select()
            .single();

        if (error) {
            console.error('Error creating custom request:', error);
            return { success: false, error: error.message };
        }

        return { success: true, request: data as CustomRequest };
    } catch (error: any) {
        console.error('Error in createCustomRequest:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get user's custom requests
 */
export async function getUserCustomRequests(): Promise<CustomRequestWithUser[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('custom_requests')
            .select(`
        *,
        user:profiles!custom_requests_user_id_fkey(*),
        assigned_admin:profiles!custom_requests_assigned_to_fkey(*)
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user custom requests:', error);
            return [];
        }

        return data as CustomRequestWithUser[];
    } catch (error) {
        console.error('Error in getUserCustomRequests:', error);
        return [];
    }
}

/**
 * Get single custom request
 */
export async function getCustomRequest(id: string): Promise<CustomRequestWithUser | null> {
    try {
        const { data, error } = await supabase
            .from('custom_requests')
            .select(`
        *,
        user:profiles!custom_requests_user_id_fkey(*),
        assigned_admin:profiles!custom_requests_assigned_to_fkey(*)
      `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching custom request:', error);
            return null;
        }

        return data as CustomRequestWithUser;
    } catch (error) {
        console.error('Error in getCustomRequest:', error);
        return null;
    }
}

/**
 * Update custom request status (admin)
 */
export async function updateCustomRequestStatus(
    id: string,
    status: CustomRequest['status'],
    adminResponse?: string,
    estimatedCost?: number
): Promise<boolean> {
    try {
        const updateData: any = {
            status,
            updated_at: new Date().toISOString(),
        };

        if (status === 'reviewing') {
            updateData.reviewed_at = new Date().toISOString();
        }

        if (status === 'completed') {
            updateData.completed_at = new Date().toISOString();
        }

        if (adminResponse) {
            updateData.admin_response = adminResponse;
        }

        if (estimatedCost !== undefined) {
            updateData.estimated_cost = estimatedCost;
        }

        const { error } = await supabase
            .from('custom_requests')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error('Error updating custom request status:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in updateCustomRequestStatus:', error);
        return false;
    }
}

/**
 * Assign custom request to admin
 */
export async function assignCustomRequest(id: string, adminId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('custom_requests')
            .update({
                assigned_to: adminId,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) {
            console.error('Error assigning custom request:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in assignCustomRequest:', error);
        return false;
    }
}

/**
 * Add admin notes to custom request
 */
export async function addAdminNotes(id: string, notes: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('custom_requests')
            .update({
                admin_notes: notes,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) {
            console.error('Error adding admin notes:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in addAdminNotes:', error);
        return false;
    }
}

/**
 * Get all custom requests (admin)
 */
export async function getAllCustomRequests(filters?: {
    status?: CustomRequest['status'];
    priority?: CustomRequest['priority'];
    assignedTo?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
}): Promise<CustomRequestWithUser[]> {
    try {
        let query = supabase
            .from('custom_requests')
            .select(`
        *,
        user:profiles!custom_requests_user_id_fkey(*),
        assigned_admin:profiles!custom_requests_assigned_to_fkey(*)
      `)
            .order('created_at', { ascending: false });

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        if (filters?.priority) {
            query = query.eq('priority', filters.priority);
        }

        if (filters?.assignedTo) {
            query = query.eq('assigned_to', filters.assignedTo);
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
            console.error('Error fetching all custom requests:', error);
            return [];
        }

        return data as CustomRequestWithUser[];
    } catch (error) {
        console.error('Error in getAllCustomRequests:', error);
        return [];
    }
}

/**
 * Get custom request statistics (admin)
 */
export async function getCustomRequestStats(): Promise<{
    total: number;
    pending: number;
    reviewing: number;
    approved: number;
    rejected: number;
    completed: number;
    averageResponseTime: number;
    conversionRate: number;
}> {
    try {
        const { data: requests, error } = await supabase
            .from('custom_requests')
            .select('*');

        if (error || !requests) {
            return {
                total: 0,
                pending: 0,
                reviewing: 0,
                approved: 0,
                rejected: 0,
                completed: 0,
                averageResponseTime: 0,
                conversionRate: 0,
            };
        }

        // Calculate average response time (pending → reviewing)
        const reviewedRequests = requests.filter(r => r.reviewed_at);
        const responseTimes = reviewedRequests.map(r => {
            const created = new Date(r.created_at).getTime();
            const reviewed = new Date(r.reviewed_at).getTime();
            return (reviewed - created) / (1000 * 60 * 60); // hours
        });
        const avgResponseTime = responseTimes.length > 0
            ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
            : 0;

        // Calculate conversion rate (approved/completed vs total)
        const converted = requests.filter(r => r.status === 'approved' || r.status === 'completed').length;
        const conversionRate = requests.length > 0 ? (converted / requests.length) * 100 : 0;

        return {
            total: requests.length,
            pending: requests.filter(r => r.status === 'pending').length,
            reviewing: requests.filter(r => r.status === 'reviewing').length,
            approved: requests.filter(r => r.status === 'approved').length,
            rejected: requests.filter(r => r.status === 'rejected').length,
            completed: requests.filter(r => r.status === 'completed').length,
            averageResponseTime: Math.round(avgResponseTime * 10) / 10,
            conversionRate: Math.round(conversionRate * 10) / 10,
        };
    } catch (error) {
        console.error('Error in getCustomRequestStats:', error);
        return {
            total: 0,
            pending: 0,
            reviewing: 0,
            approved: 0,
            rejected: 0,
            completed: 0,
            averageResponseTime: 0,
            conversionRate: 0,
        };
    }
}

/**
 * Export custom requests to CSV (admin)
 */
export async function exportCustomRequestsToCSV(filters?: {
    status?: CustomRequest['status'];
    startDate?: string;
    endDate?: string;
}): Promise<string> {
    try {
        const requests = await getAllCustomRequests(filters);

        const headers = [
            'Reference',
            'User Email',
            'Status',
            'Priority',
            'Destination',
            'Travel Dates',
            'Duration',
            'Budget Min',
            'Budget Max',
            'Travelers',
            'Interests',
            'Estimated Cost',
            'Assigned To',
            'Created At',
            'Reviewed At',
        ];

        const rows = requests.map(r => [
            r.request_reference,
            r.user?.email || '',
            r.status,
            r.priority,
            r.destination || '',
            r.travel_dates ? `${r.travel_dates.start} to ${r.travel_dates.end}` : '',
            r.duration || '',
            r.budget_min || '',
            r.budget_max || '',
            r.number_of_travelers,
            Array.isArray(r.interests) ? r.interests.join('; ') : '',
            r.estimated_cost || '',
            r.assigned_admin?.email || '',
            r.created_at,
            r.reviewed_at || '',
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
        ].join('\n');

        return csv;
    } catch (error) {
        console.error('Error in exportCustomRequestsToCSV:', error);
        throw error;
    }
}
