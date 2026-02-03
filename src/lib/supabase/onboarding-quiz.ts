import { supabase } from '@/integrations/supabase/client';
import {
    OnboardingQuizState,
    OnboardingQuizRecord,
    stateToRecord,
    recordToState
} from '@/types/onboarding-quiz';

/**
 * Save onboarding quiz response to database
 */
export async function saveOnboardingQuiz(
    state: OnboardingQuizState,
    userId: string
): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const record = stateToRecord(state, userId);

        // Mark as submitted
        record.completion_status = 'submitted';

        const { data, error } = await (supabase
            .from('onboarding_quiz_responses') as any)
            .insert([record])
            .select()
            .single();

        if (error) {
            console.error('[saveOnboardingQuiz] ❌ Error:', error);
            return { success: false, error: error.message };
        }

        console.log('[saveOnboardingQuiz] ✅ Saved quiz response:', data.id);

        // If user selected "surprise", create a surprise request
        if (state.destinationKnowledge === 'surprise') {
            await createSurpriseRequestFromQuiz(data.id, userId, state);
        }

        return { success: true, id: data.id };
    } catch (error: any) {
        console.error('[saveOnboardingQuiz] ❌ Exception:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Create a surprise request from quiz data
 */
async function createSurpriseRequestFromQuiz(
    quizId: string,
    userId: string,
    state: OnboardingQuizState
): Promise<void> {
    try {
        const requestReference = `SR${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        // Calculate number of travelers based on companion type
        let numberOfTravelers = 1;
        switch (state.travelCompanion) {
            case 'solo': numberOfTravelers = 1; break;
            case 'couple': numberOfTravelers = 2; break;
            case 'family': numberOfTravelers = 4; break;
            case 'friends': numberOfTravelers = 4; break;
            case 'open_group': numberOfTravelers = 1; break;
        }

        // Initialize clue schedule
        const clueSchedule = [
            { week: 1, clue_text: 'Week 1 clue coming soon...' },
            { week: 2, clue_text: 'Week 2 clue coming soon...' },
            { week: 3, clue_text: 'Week 3 clue coming soon...' },
            { week: 4, clue_text: 'Week 4 clue coming soon...' },
            { week: 5, clue_text: 'Final reveal!' },
        ];

        // Parse budget to min/max
        let budgetMin = 0, budgetMax = 0;
        switch (state.budgetRange) {
            case 'budget': budgetMin = 20000; budgetMax = 40000; break;
            case 'mid-range': budgetMin = 40000; budgetMax = 80000; break;
            case 'luxury': budgetMin = 80000; budgetMax = 200000; break;
            case 'flexible': budgetMin = 20000; budgetMax = 200000; break;
        }

        const surpriseRequest = {
            user_id: userId,
            onboarding_quiz_id: quizId,
            request_reference: requestReference,
            status: 'pending',
            personality: state.travelVibe,
            interests: state.tripStyles,
            budget_min: budgetMin,
            budget_max: budgetMax,
            duration: state.tripDuration,
            travel_date_type: state.planningDatesType,
            travel_dates: state.specificDates,
            number_of_travelers: numberOfTravelers,
            places_to_avoid: state.placesToAvoid,
            destination_regions: [],
            clue_schedule: clueSchedule,
            reveal_animation_type: 'scratch_off',
            is_published: false,
        };

        const { data: requestData, error } = await (supabase
            .from('surprise_requests') as any)
            .insert([surpriseRequest])
            .select('id')
            .single();

        if (error) {
            console.error('[createSurpriseRequestFromQuiz] ❌ Error:', error);
        } else if (requestData) {
            console.log('[createSurpriseRequestFromQuiz] ✅ Created surprise request:', requestData.id);

            // Link back to the quiz
            const { error: updateError } = await (supabase
                .from('onboarding_quiz_responses') as any)
                .update({ linked_surprise_request_id: requestData.id })
                .eq('id', quizId);

            if (updateError) {
                console.error('[createSurpriseRequestFromQuiz] ❌ Error linking request to quiz:', updateError);
            } else {
                console.log('[createSurpriseRequestFromQuiz] ✅ Linked request to quiz');
            }
        }
    } catch (error) {
        console.error('[createSurpriseRequestFromQuiz] ❌ Exception:', error);
    }
}

/**
 * Get user's onboarding quiz responses
 */
export async function getUserOnboardingQuizzes(): Promise<OnboardingQuizRecord[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('onboarding_quiz_responses')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[getUserOnboardingQuizzes] ❌ Error:', error);
            return [];
        }

        return data as OnboardingQuizRecord[];
    } catch (error) {
        console.error('[getUserOnboardingQuizzes] ❌ Exception:', error);
        return [];
    }
}

/**
 * Get single onboarding quiz by ID
 */
export async function getOnboardingQuiz(id: string): Promise<OnboardingQuizRecord | null> {
    try {
        const { data, error } = await supabase
            .from('onboarding_quiz_responses')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('[getOnboardingQuiz] ❌ Error:', error);
            return null;
        }

        return data as OnboardingQuizRecord;
    } catch (error) {
        console.error('[getOnboardingQuiz] ❌ Exception:', error);
        return null;
    }
}

/**
 * Get all onboarding quizzes (admin only)
 */
export async function getAllOnboardingQuizzes(filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
}): Promise<OnboardingQuizRecord[]> {
    try {
        let query = supabase
            .from('onboarding_quiz_responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters?.status) {
            query = query.eq('completion_status', filters.status);
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
            console.error('[getAllOnboardingQuizzes] ❌ Error:', error);
            return [];
        }

        return data as OnboardingQuizRecord[];
    } catch (error) {
        console.error('[getAllOnboardingQuizzes] ❌ Exception:', error);
        return [];
    }
}

/**
 * Get onboarding quiz with user profile (admin)
 */
export async function getOnboardingQuizWithUser(id: string): Promise<{
    quiz: OnboardingQuizRecord;
    user: any;
} | null> {
    try {
        const { data, error } = await supabase
            .from('onboarding_quiz_responses')
            .select(`
        *,
        user:profiles(*)
      `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('[getOnboardingQuizWithUser] ❌ Error:', error);
            return null;
        }

        return {
            quiz: data as OnboardingQuizRecord,
            user: data ? (data as any).user : null,
        };
    } catch (error) {
        console.error('[getOnboardingQuizWithUser] ❌ Exception:', error);
        return null;
    }
}

/**
 * Update onboarding quiz (admin)
 */
export async function updateOnboardingQuiz(
    id: string,
    updates: Partial<OnboardingQuizRecord>
): Promise<boolean> {
    try {
        const { error } = await (supabase
            .from('onboarding_quiz_responses') as any)
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('[updateOnboardingQuiz] ❌ Error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('[updateOnboardingQuiz] ❌ Exception:', error);
        return false;
    }
}

/**
 * Get onboarding quiz analytics (admin)
 */
export async function getOnboardingQuizAnalytics(): Promise<{
    total: number;
    submitted: number;
    vibeDistribution: Record<string, number>;
    budgetDistribution: Record<string, number>;
    companionDistribution: Record<string, number>;
    topDestinations: string[];
    surpriseVsKnown: { surprise: number; known: number; open: number };
}> {
    try {
        const { data: quizzes, error } = await (supabase
            .from('onboarding_quiz_responses') as any)
            .select('*');

        if (error || !quizzes) {
            return {
                total: 0,
                submitted: 0,
                vibeDistribution: {},
                budgetDistribution: {},
                companionDistribution: {},
                topDestinations: [],
                surpriseVsKnown: { surprise: 0, known: 0, open: 0 },
            };
        }

        const submitted = quizzes.filter((q: any) => q.completion_status === 'submitted');

        // Vibe distribution
        const vibeDistribution: Record<string, number> = {};
        quizzes.forEach((q: any) => {
            if (q.travel_vibe) {
                vibeDistribution[q.travel_vibe] = (vibeDistribution[q.travel_vibe] || 0) + 1;
            }
        });

        // Budget distribution
        const budgetDistribution: Record<string, number> = {};
        quizzes.forEach((q: any) => {
            if (q.budget_range) {
                budgetDistribution[q.budget_range] = (budgetDistribution[q.budget_range] || 0) + 1;
            }
        });

        // Companion distribution
        const companionDistribution: Record<string, number> = {};
        quizzes.forEach((q: any) => {
            if (q.travel_companion) {
                companionDistribution[q.travel_companion] = (companionDistribution[q.travel_companion] || 0) + 1;
            }
        });

        // Top destinations
        const destinationCounts: Record<string, number> = {};
        quizzes.forEach((q: any) => {
            if (q.desired_destinations && Array.isArray(q.desired_destinations)) {
                q.desired_destinations.forEach((dest: string) => {
                    destinationCounts[dest] = (destinationCounts[dest] || 0) + 1;
                });
            }
        });
        const topDestinations = Object.entries(destinationCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([dest]) => dest);

        // Surprise vs Known
        const surpriseVsKnown = { surprise: 0, known: 0, open: 0 };
        quizzes.forEach((q: any) => {
            if (q.destination_knowledge === 'surprise') surpriseVsKnown.surprise++;
            else if (q.destination_knowledge === 'tell_me') surpriseVsKnown.known++;
            else if (q.destination_knowledge === 'open_both') surpriseVsKnown.open++;
        });

        return {
            total: quizzes.length,
            submitted: submitted.length,
            vibeDistribution,
            budgetDistribution,
            companionDistribution,
            topDestinations,
            surpriseVsKnown,
        };
    } catch (error) {
        console.error('[getOnboardingQuizAnalytics] ❌ Exception:', error);
        return {
            total: 0,
            submitted: 0,
            vibeDistribution: {},
            budgetDistribution: {},
            companionDistribution: {},
            topDestinations: [],
            surpriseVsKnown: { surprise: 0, known: 0, open: 0 },
        };
    }
}

/**
 * Export onboarding quizzes to CSV (admin)
 */
export async function exportOnboardingQuizzesToCSV(): Promise<string> {
    try {
        const quizzes = await getAllOnboardingQuizzes();

        const headers = [
            'ID', 'Session ID', 'Status', 'Travel Companion', 'Departure',
            'Passport', 'Destination Preference', 'Desired Destinations',
            'Trip Styles', 'Experience Pace', 'Hard No Activities',
            'Food Preferences', 'Health Conditions', 'Duration', 'Budget',
            'Planning Dates', 'Amigo Role', 'Destination Knowledge',
            'Travel Vibe', 'Additional Notes', 'Created At', 'Submitted At'
        ];

        const rows = quizzes.map(q => [
            q.id,
            q.session_id,
            q.completion_status,
            q.travel_companion || '',
            q.departure_location || '',
            q.passport_nationality || '',
            q.destination_preference || '',
            (q.desired_destinations || []).join('; '),
            (q.trip_styles || []).join('; '),
            q.experience_pace || '',
            (q.hard_no_activities || []).join('; '),
            (q.food_preferences || []).join('; '),
            (q.health_conditions || []).join('; '),
            q.trip_duration || '',
            q.budget_range || '',
            q.planning_dates_type || '',
            q.amigo_role || '',
            q.destination_knowledge || '',
            q.travel_vibe || '',
            q.additional_notes || '',
            q.created_at,
            q.submitted_at || '',
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
        ].join('\n');

        return csv;
    } catch (error) {
        console.error('[exportOnboardingQuizzesToCSV] ❌ Exception:', error);
        throw error;
    }
}
