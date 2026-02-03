import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { OnboardingQuizRecord } from '@/types/onboarding-quiz';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to fetch the user's onboarding quiz submission
 */
export function useOnboardingQuiz() {
    const { user } = useAuth();

    return useQuery<OnboardingQuizRecord | null>({
        queryKey: ['onboarding-quiz', user?.id],
        queryFn: async () => {
            if (!user?.id) return null;

            const { data, error } = await supabase
                .from('onboarding_quiz_responses')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_submitted', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching onboarding quiz:', error);
                return null;
            }

            return data;
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Hook to check if the user has completed the onboarding quiz
 */
export function useHasCompletedQuiz() {
    const { user } = useAuth();

    return useQuery<boolean>({
        queryKey: ['has-completed-quiz', user?.id],
        queryFn: async () => {
            if (!user?.id) return false;

            const { count, error } = await supabase
                .from('onboarding_quiz_responses')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_submitted', true);

            if (error) {
                console.error('Error checking quiz completion:', error);
                return false;
            }

            return (count || 0) > 0;
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Hook to fetch the user's linked surprise request (from a submitted quiz)
 */
export function useLinkedSurpriseRequest() {
    const { user } = useAuth();

    return useQuery<{
        id: string;
        status: 'pending' | 'planning' | 'clues_sent' | 'ready' | 'revealed' | 'completed';
        suggested_destination?: string;
        admin_notes?: string;
        created_at: string;
        updated_at: string;
    } | null>({
        queryKey: ['linked-surprise-request', user?.id],
        queryFn: async () => {
            if (!user?.id) return null;

            // First find the quiz with linked surprise request
            const { data: quiz, error: quizError } = await supabase
                .from('onboarding_quiz_responses')
                .select('linked_surprise_request_id')
                .eq('user_id', user.id)
                .eq('is_submitted', true)
                .not('linked_surprise_request_id', 'is', null)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (quizError || !quiz?.linked_surprise_request_id) {
                return null;
            }

            // Fetch the surprise request
            const { data: request, error: requestError } = await supabase
                .from('surprise_requests')
                .select('id, status, suggested_destination, admin_notes, created_at, updated_at')
                .eq('id', quiz.linked_surprise_request_id)
                .single();

            if (requestError) {
                console.error('Error fetching linked surprise request:', requestError);
                return null;
            }

            return request;
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 2, // 2 minutes - more frequent updates for status changes
    });
}

export default useOnboardingQuiz;
