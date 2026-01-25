/**
 * Signup Session Manager
 * Manages questionnaire data in sessionStorage before account creation
 */

export type TripType = 'surprise' | 'group' | 'standard' | 'custom';

export interface SignupSessionData {
    tripType: TripType;
    email: string;
    fullName: string;
    questionnaireData: Record<string, any>;
    timestamp: number;
}

const SESSION_KEY = 'travelamigo_signup_session';

/**
 * Save signup session data to sessionStorage
 */
export const saveSignupSession = (data: SignupSessionData): void => {
    try {
        const sessionData = {
            ...data,
            timestamp: Date.now(),
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        console.log('[SignupSession] Saved:', sessionData);
    } catch (error) {
        console.error('[SignupSession] Error saving session:', error);
    }
};

/**
 * Get signup session data from sessionStorage
 */
export const getSignupSession = (): SignupSessionData | null => {
    try {
        const data = sessionStorage.getItem(SESSION_KEY);
        if (!data) {
            console.log('[SignupSession] No session found');
            return null;
        }

        const parsed = JSON.parse(data) as SignupSessionData;

        // Check if session is older than 1 hour (expired)
        const ONE_HOUR = 60 * 60 * 1000;
        if (Date.now() - parsed.timestamp > ONE_HOUR) {
            console.log('[SignupSession] Session expired');
            clearSignupSession();
            return null;
        }

        console.log('[SignupSession] Retrieved:', parsed);
        return parsed;
    } catch (error) {
        console.error('[SignupSession] Error getting session:', error);
        return null;
    }
};

/**
 * Clear signup session from sessionStorage
 */
export const clearSignupSession = (): void => {
    try {
        sessionStorage.removeItem(SESSION_KEY);
        console.log('[SignupSession] Cleared');
    } catch (error) {
        console.error('[SignupSession] Error clearing session:', error);
    }
};

/**
 * Check if there's a pending signup session
 */
export const hasPendingSession = (): boolean => {
    return getSignupSession() !== null;
};
