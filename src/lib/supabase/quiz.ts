import { supabase } from '@/integrations/supabase/client';
import type { QuizProfile } from '@/pages/TravelProfileQuizComplete';

export interface QuizResponse {
    id?: string;
    user_id?: string;
    email: string;
    name?: string;
    phone?: string;
    personality: string;
    interests: string[];
    duration: string;
    travel_date_type?: 'specific' | 'flexible' | 'month';
    preferred_month?: string;
    specific_dates?: { start: string; end: string };
    budget_min: number;
    budget_max: number;
    travel_style: string;
    destination_regions?: string[];
    places_to_avoid?: string[];
    result_type: 'matched' | 'surprise' | 'custom';
    matched_trip_id?: string;
    created_at?: string;
    updated_at?: string;
}

export interface QuizAnalytics {
    total_responses: number;
    completion_rate: number;
    email_capture_rate: number;
    popular_personalities: { [key: string]: number };
    popular_interests: { [key: string]: number };
    average_budget: number;
    result_type_distribution: { matched: number; surprise: number; custom: number };
    conversion_rate: number;
}

/**
 * Save quiz response to database
 */
export async function saveQuizResponse(profile: Partial<QuizProfile>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        // Get current user if logged in
        const { data: { user } } = await supabase.auth.getUser();

        const quizResponse: Partial<QuizResponse> = {
            user_id: user?.id,
            email: profile.email!,
            name: profile.name,
            phone: profile.phone,
            personality: profile.personality!,
            interests: profile.interests || [],
            duration: profile.duration!,
            travel_date_type: profile.travelDateType,
            preferred_month: profile.preferredMonth,
            specific_dates: profile.specificDates,
            budget_min: profile.budget?.min || 0,
            budget_max: profile.budget?.max || 0,
            travel_style: profile.travelStyle!,
            destination_regions: profile.destinationRegions || [],
            places_to_avoid: profile.placesToAvoid || [],
            result_type: profile.resultType!,
        };

        const { data, error } = await supabase
            .from('quiz_responses')
            .insert([quizResponse])
            .select()
            .single();

        if (error) {
            console.error('Error saving quiz response:', error);
            return { success: false, error: error.message };
        }

        // Update user profile with email if not logged in
        if (!user && profile.email) {
            await updateProfileFromQuiz(profile);
        }

        return { success: true, id: data.id };
    } catch (error: any) {
        console.error('Error in saveQuizResponse:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update user profile with quiz data
 */
export async function updateProfileFromQuiz(profile: Partial<QuizProfile>): Promise<void> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
            .from('profiles')
            .update({
                full_name: profile.name,
                phone: profile.phone,
                travel_preferences: {
                    personality: profile.personality,
                    interests: profile.interests,
                    duration: profile.duration,
                    budget: profile.budget,
                    travel_style: profile.travelStyle,
                    destination_regions: profile.destinationRegions,
                    places_to_avoid: profile.placesToAvoid,
                },
            })
            .eq('id', user.id);
    } catch (error) {
        console.error('Error updating profile from quiz:', error);
    }
}

/**
 * Get quiz response by ID
 */
export async function getQuizResponse(id: string): Promise<QuizResponse | null> {
    try {
        const { data, error } = await supabase
            .from('quiz_responses')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching quiz response:', error);
            return null;
        }

        return data as QuizResponse;
    } catch (error) {
        console.error('Error in getQuizResponse:', error);
        return null;
    }
}

/**
 * Get user's quiz responses
 */
export async function getUserQuizResponses(): Promise<QuizResponse[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('quiz_responses')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user quiz responses:', error);
            return [];
        }

        return data as QuizResponse[];
    } catch (error) {
        console.error('Error in getUserQuizResponses:', error);
        return [];
    }
}

/**
 * Get quiz analytics (admin only)
 */
export async function getQuizAnalytics(): Promise<QuizAnalytics | null> {
    try {
        const { data: responses, error } = await supabase
            .from('quiz_responses')
            .select('*');

        if (error) {
            console.error('Error fetching quiz analytics:', error);
            return null;
        }

        if (!responses || responses.length === 0) {
            return {
                total_responses: 0,
                completion_rate: 0,
                email_capture_rate: 0,
                popular_personalities: {},
                popular_interests: {},
                average_budget: 0,
                result_type_distribution: { matched: 0, surprise: 0, custom: 0 },
                conversion_rate: 0,
            };
        }

        // Calculate analytics
        const totalResponses = responses.length;
        const emailCaptured = responses.filter(r => r.email).length;

        // Popular personalities
        const personalities: { [key: string]: number } = {};
        responses.forEach(r => {
            if (r.personality) {
                personalities[r.personality] = (personalities[r.personality] || 0) + 1;
            }
        });

        // Popular interests
        const interests: { [key: string]: number } = {};
        responses.forEach(r => {
            if (r.interests && Array.isArray(r.interests)) {
                r.interests.forEach((interest: string) => {
                    interests[interest] = (interests[interest] || 0) + 1;
                });
            }
        });

        // Average budget
        const budgets = responses.filter(r => r.budget_min && r.budget_max);
        const averageBudget = budgets.length > 0
            ? budgets.reduce((sum, r) => sum + ((r.budget_min + r.budget_max) / 2), 0) / budgets.length
            : 0;

        // Result type distribution
        const resultTypes = { matched: 0, surprise: 0, custom: 0 };
        responses.forEach(r => {
            if (r.result_type) {
                resultTypes[r.result_type as keyof typeof resultTypes]++;
            }
        });

        // Get bookings count for conversion rate
        const { count: bookingsCount } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true });

        const conversionRate = totalResponses > 0 ? ((bookingsCount || 0) / totalResponses) * 100 : 0;

        return {
            total_responses: totalResponses,
            completion_rate: 100, // All responses in DB are completed
            email_capture_rate: (emailCaptured / totalResponses) * 100,
            popular_personalities: personalities,
            popular_interests: interests,
            average_budget: Math.round(averageBudget),
            result_type_distribution: resultTypes,
            conversion_rate: Math.round(conversionRate * 100) / 100,
        };
    } catch (error) {
        console.error('Error in getQuizAnalytics:', error);
        return null;
    }
}

/**
 * Get quiz responses with filters (admin only)
 */
export async function getQuizResponsesFiltered(filters: {
    startDate?: string;
    endDate?: string;
    resultType?: 'matched' | 'surprise' | 'custom';
    personality?: string;
    limit?: number;
}): Promise<QuizResponse[]> {
    try {
        let query = supabase
            .from('quiz_responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters.startDate) {
            query = query.gte('created_at', filters.startDate);
        }

        if (filters.endDate) {
            query = query.lte('created_at', filters.endDate);
        }

        if (filters.resultType) {
            query = query.eq('result_type', filters.resultType);
        }

        if (filters.personality) {
            query = query.eq('personality', filters.personality);
        }

        if (filters.limit) {
            query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching filtered quiz responses:', error);
            return [];
        }

        return data as QuizResponse[];
    } catch (error) {
        console.error('Error in getQuizResponsesFiltered:', error);
        return [];
    }
}

/**
 * Delete quiz response (admin only)
 */
export async function deleteQuizResponse(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('quiz_responses')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting quiz response:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in deleteQuizResponse:', error);
        return false;
    }
}

/**
 * Export quiz responses to CSV (admin only)
 */
export async function exportQuizResponsesToCSV(): Promise<string> {
    try {
        const { data: responses, error } = await supabase
            .from('quiz_responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !responses) {
            throw new Error('Failed to fetch quiz responses');
        }

        // CSV headers
        const headers = [
            'ID',
            'Email',
            'Name',
            'Phone',
            'Personality',
            'Interests',
            'Duration',
            'Travel Date Type',
            'Preferred Month',
            'Budget Min',
            'Budget Max',
            'Travel Style',
            'Destination Regions',
            'Places to Avoid',
            'Result Type',
            'Created At',
        ];

        // CSV rows
        const rows = responses.map(r => [
            r.id,
            r.email,
            r.name || '',
            r.phone || '',
            r.personality,
            Array.isArray(r.interests) ? r.interests.join('; ') : '',
            r.duration,
            r.travel_date_type || '',
            r.preferred_month || '',
            r.budget_min,
            r.budget_max,
            r.travel_style,
            Array.isArray(r.destination_regions) ? r.destination_regions.join('; ') : '',
            Array.isArray(r.places_to_avoid) ? r.places_to_avoid.join('; ') : '',
            r.result_type,
            r.created_at,
        ]);

        // Combine headers and rows
        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
        ].join('\n');

        return csv;
    } catch (error) {
        console.error('Error in exportQuizResponsesToCSV:', error);
        throw error;
    }
}
