import { supabase } from '@/integrations/supabase/client';

export interface SurpriseRequest {
    id?: string;
    user_id: string;
    request_reference?: string;
    status: 'pending' | 'planning' | 'clues_sent' | 'revealed' | 'completed' | 'cancelled';
    personality?: string;
    interests?: string[];
    budget_min?: number;
    budget_max?: number;
    duration?: string;
    travel_date_type?: 'flexible' | 'month' | 'specific';
    preferred_month?: string;
    travel_dates?: { start: string; end: string };
    number_of_travelers: number;
    places_to_avoid?: string[];
    destination_regions?: string[];
    assigned_destination?: string;
    reveal_date?: string;
    clue_schedule?: {
        week: number;
        sent_at?: string;
        clue_text?: string;
    }[];
    admin_notes?: string;
    created_at?: string;
    updated_at?: string;
    revealed_at?: string;
}

export interface SurpriseRequestWithUser extends SurpriseRequest {
    user?: any;
}

/**
 * Create surprise trip request
 */
export async function createSurpriseRequest(requestData: Partial<SurpriseRequest>): Promise<{ success: boolean; request?: SurpriseRequest; error?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const requestReference = `SR${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        // Initialize 5-week clue schedule
        const clueSchedule = [
            { week: 1, clue_text: 'Week 1 clue will be sent...' },
            { week: 2, clue_text: 'Week 2 clue will be sent...' },
            { week: 3, clue_text: 'Week 3 clue will be sent...' },
            { week: 4, clue_text: 'Week 4 clue will be sent...' },
            { week: 5, clue_text: 'Week 5 - Final reveal!' },
        ];

        const request: Partial<SurpriseRequest> = {
            ...requestData,
            user_id: user.id,
            request_reference: requestReference,
            status: 'pending',
            clue_schedule: clueSchedule,
        };

        const { data, error } = await (supabase
            .from('surprise_requests') as any)
            .insert([request])
            .select()
            .single();

        if (error) {
            console.error('Error creating surprise request:', error);
            return { success: false, error: error.message };
        }

        return { success: true, request: data as SurpriseRequest };
    } catch (error: any) {
        console.error('Error in createSurpriseRequest:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get user's surprise requests
 */
export async function getUserSurpriseRequests(): Promise<SurpriseRequestWithUser[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('surprise_requests')
            .select(`
        *,
        user:profiles(*)
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user surprise requests:', error);
            return [];
        }

        return data as SurpriseRequestWithUser[];
    } catch (error) {
        console.error('Error in getUserSurpriseRequests:', error);
        return [];
    }
}

/**
 * Get single surprise request
 */
export async function getSurpriseRequest(id: string): Promise<SurpriseRequestWithUser | null> {
    try {
        const { data, error } = await supabase
            .from('surprise_requests')
            .select(`
        *,
        user:profiles(*)
      `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching surprise request:', error);
            return null;
        }

        return data as SurpriseRequestWithUser;
    } catch (error) {
        console.error('Error in getSurpriseRequest:', error);
        return null;
    }
}

/**
 * Update surprise request status (admin)
 */
export async function updateSurpriseRequestStatus(
    id: string,
    status: SurpriseRequest['status']
): Promise<boolean> {
    try {
        const updateData: any = {
            status,
            updated_at: new Date().toISOString(),
        };

        if (status === 'revealed') {
            updateData.revealed_at = new Date().toISOString();
        }

        const { error } = await (supabase
            .from('surprise_requests') as any)
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error('Error updating surprise request status:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in updateSurpriseRequestStatus:', error);
        return false;
    }
}

/**
 * Assign destination to surprise request (admin)
 */
export async function assignSurpriseDestination(
    id: string,
    destination: string,
    revealDate: string
): Promise<boolean> {
    try {
        const { error } = await (supabase
            .from('surprise_requests') as any)
            .update({
                assigned_destination: destination,
                reveal_date: revealDate,
                status: 'planning',
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) {
            console.error('Error assigning surprise destination:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in assignSurpriseDestination:', error);
        return false;
    }
}

/**
 * Update clue for specific week (admin)
 */
export async function updateSurpriseClue(
    id: string,
    week: number,
    clueText: string,
    markAsSent: boolean = false
): Promise<boolean> {
    try {
        // First, get the current request to update clue_schedule
        const request = await getSurpriseRequest(id);
        if (!request || !request.clue_schedule) return false;

        const updatedSchedule = request.clue_schedule.map(clue => {
            if (clue.week === week) {
                return {
                    ...clue,
                    clue_text: clueText,
                    sent_at: markAsSent ? new Date().toISOString() : clue.sent_at,
                };
            }
            return clue;
        });

        const { error } = await (supabase
            .from('surprise_requests') as any)
            .update({
                clue_schedule: updatedSchedule,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating surprise clue:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in updateSurpriseClue:', error);
        return false;
    }
}

/**
 * Mark clue as sent (admin)
 */
export async function markClueAsSent(id: string, week: number): Promise<boolean> {
    try {
        const request = await getSurpriseRequest(id);
        if (!request || !request.clue_schedule) return false;

        const updatedSchedule = request.clue_schedule.map(clue => {
            if (clue.week === week) {
                return {
                    ...clue,
                    sent_at: new Date().toISOString(),
                };
            }
            return clue;
        });

        const { error } = await (supabase
            .from('surprise_requests') as any)
            .update({
                clue_schedule: updatedSchedule,
                status: week >= 5 ? 'revealed' : 'clues_sent',
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) {
            console.error('Error marking clue as sent:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in markClueAsSent:', error);
        return false;
    }
}

/**
 * Get all surprise requests (admin)
 */
export async function getAllSurpriseRequests(filters?: {
    status?: SurpriseRequest['status'];
    startDate?: string;
    endDate?: string;
    limit?: number;
}): Promise<SurpriseRequestWithUser[]> {
    try {
        let query = supabase
            .from('surprise_requests')
            .select(`
        *,
        user:profiles(*)
      `)
            .order('created_at', { ascending: false });

        if (filters?.status) {
            query = query.eq('status', filters.status);
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
            console.error('Error fetching all surprise requests:', error);
            return [];
        }

        return data as SurpriseRequestWithUser[];
    } catch (error) {
        console.error('Error in getAllSurpriseRequests:', error);
        return [];
    }
}

/**
 * Get surprise request statistics (admin)
 */
export async function getSurpriseRequestStats(): Promise<{
    total: number;
    pending: number;
    planning: number;
    cluesSent: number;
    revealed: number;
    completed: number;
    cancelled: number;
    averageRevealTime: number;
}> {
    try {
        const { data: requests, error } = await (supabase
            .from('surprise_requests') as any)
            .select('*');

        if (error || !requests) {
            return {
                total: 0,
                pending: 0,
                planning: 0,
                cluesSent: 0,
                revealed: 0,
                completed: 0,
                cancelled: 0,
                averageRevealTime: 0,
            };
        }

        // Calculate average reveal time (created → revealed)
        const revealedRequests = requests.filter(r => r.revealed_at);
        const revealTimes = revealedRequests.map(r => {
            const created = new Date(r.created_at).getTime();
            const revealed = new Date(r.revealed_at).getTime();
            return (revealed - created) / (1000 * 60 * 60 * 24); // days
        });
        const avgRevealTime = revealTimes.length > 0
            ? revealTimes.reduce((sum, time) => sum + time, 0) / revealTimes.length
            : 0;

        return {
            total: requests.length,
            pending: requests.filter(r => r.status === 'pending').length,
            planning: requests.filter(r => r.status === 'planning').length,
            cluesSent: requests.filter(r => r.status === 'clues_sent').length,
            revealed: requests.filter(r => r.status === 'revealed').length,
            completed: requests.filter(r => r.status === 'completed').length,
            cancelled: requests.filter(r => r.status === 'cancelled').length,
            averageRevealTime: Math.round(avgRevealTime * 10) / 10,
        };
    } catch (error) {
        console.error('Error in getSurpriseRequestStats:', error);
        return {
            total: 0,
            pending: 0,
            planning: 0,
            cluesSent: 0,
            revealed: 0,
            completed: 0,
            cancelled: 0,
            averageRevealTime: 0,
        };
    }
}

/**
 * Get clues that need to be sent (admin)
 */
export async function getCluesDueToSend(): Promise<Array<{
    requestId: string;
    week: number;
    userEmail: string;
    clueText: string;
}>> {
    try {
        const requests = await getAllSurpriseRequests({ status: 'planning' });
        const dueClues: Array<{
            requestId: string;
            week: number;
            userEmail: string;
            clueText: string;
        }> = [];

        requests.forEach(request => {
            if (!request.clue_schedule || !request.reveal_date) return;

            const revealDate = new Date(request.reveal_date);
            const now = new Date();
            const weeksUntilReveal = Math.ceil((revealDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7));

            // Check which clues should have been sent
            request.clue_schedule.forEach(clue => {
                const shouldBeSentByWeek = 6 - clue.week; // Week 1 sent 5 weeks before, Week 2 sent 4 weeks before, etc.
                if (weeksUntilReveal <= shouldBeSentByWeek && !clue.sent_at) {
                    dueClues.push({
                        requestId: request.id!,
                        week: clue.week,
                        userEmail: request.user?.email || '',
                        clueText: clue.clue_text || '',
                    });
                }
            });
        });

        return dueClues;
    } catch (error) {
        console.error('Error in getCluesDueToSend:', error);
        return [];
    }
}

/**
 * Export surprise requests to CSV (admin)
 */
export async function exportSurpriseRequestsToCSV(filters?: {
    status?: SurpriseRequest['status'];
    startDate?: string;
    endDate?: string;
}): Promise<string> {
    try {
        const requests = await getAllSurpriseRequests(filters);

        const headers = [
            'Reference',
            'User Email',
            'Status',
            'Personality',
            'Interests',
            'Budget Min',
            'Budget Max',
            'Duration',
            'Travelers',
            'Assigned Destination',
            'Reveal Date',
            'Clues Sent',
            'Created At',
            'Revealed At',
        ];

        const rows = requests.map(r => [
            r.request_reference,
            r.user?.email || '',
            r.status,
            r.personality || '',
            Array.isArray(r.interests) ? r.interests.join('; ') : '',
            r.budget_min || '',
            r.budget_max || '',
            r.duration || '',
            r.number_of_travelers,
            r.assigned_destination || '',
            r.reveal_date || '',
            r.clue_schedule?.filter(c => c.sent_at).length || 0,
            r.created_at,
            r.revealed_at || '',
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
        ].join('\n');

        return csv;
    } catch (error) {
        console.error('Error in exportSurpriseRequestsToCSV:', error);
        throw error;
    }
}
