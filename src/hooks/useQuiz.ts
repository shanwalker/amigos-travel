import { useQuery } from '@tanstack/react-query';
import {
    getUserQuizResponses,
    getQuizResponse,
    getQuizAnalytics,
    getQuizResponsesFiltered,
} from '@/lib/supabase/quiz';

export function useUserQuizResponses() {
    return useQuery({
        queryKey: ['quiz', 'user-responses'],
        queryFn: getUserQuizResponses,
    });
}

export function useQuizResponse(id: string) {
    return useQuery({
        queryKey: ['quiz', 'response', id],
        queryFn: () => getQuizResponse(id),
        enabled: !!id,
    });
}

export function useQuizAnalytics() {
    return useQuery({
        queryKey: ['quiz', 'analytics'],
        queryFn: getQuizAnalytics,
    });
}

export function useQuizResponsesFiltered(filters?: {
    startDate?: string;
    endDate?: string;
    resultType?: 'matched' | 'surprise' | 'custom';
    personality?: string;
    limit?: number;
}) {
    return useQuery({
        queryKey: ['quiz', 'filtered', filters],
        queryFn: () => getQuizResponsesFiltered(filters || {}),
    });
}
