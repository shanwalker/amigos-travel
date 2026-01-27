/**
 * Signup Session Manager
 * Manages questionnaire data in sessionStorage before account creation
 */

export type TripType = 'surprise' | 'group' | 'standard' | 'custom';
export type TripTypeSelection = TripType;

export interface SignupSessionData {
    tripType: TripType;
    email?: string;
    fullName?: string;
    questionnaireData?: Record<string, any>;
    questionnaireAnswers?: Record<string, any>;
    sourcePage?: string;
    selectedTripId?: string;
    timestamp: number;
}

const SESSION_KEY = 'travelamigo_signup_session';
const TRIP_ID_KEY = 'travelamigo_selected_trip_id';

/**
 * Create a new signup session with trip type
 */
export const createSignupSession = (tripType: TripType, sourcePage: string = '/'): void => {
    try {
        const sessionData: SignupSessionData = {
            tripType,
            sourcePage,
            questionnaireAnswers: {},
            timestamp: Date.now(),
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        console.log('[SignupSession] Created:', sessionData);
    } catch (error) {
        console.error('[SignupSession] Error creating session:', error);
    }
};

/**
 * Update questionnaire answers in the session
 */
export const updateQuestionnaireAnswers = (answers: Record<string, any>): void => {
    try {
        const session = getSignupSession();
        if (session) {
            session.questionnaireAnswers = {
                ...session.questionnaireAnswers,
                ...answers,
            };
            session.timestamp = Date.now();
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
            console.log('[SignupSession] Updated answers:', session);
        }
    } catch (error) {
        console.error('[SignupSession] Error updating answers:', error);
    }
};

/**
 * Prepare session data for database insert
 */
export const prepareForDatabaseInsert = (): SignupSessionData | null => {
    return getSignupSession();
};

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
        sessionStorage.removeItem(TRIP_ID_KEY);
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

/**
 * Set selected trip ID
 */
export const setSelectedTripId = (tripId: string): void => {
    try {
        sessionStorage.setItem(TRIP_ID_KEY, tripId);
        const session = getSignupSession();
        if (session) {
            session.selectedTripId = tripId;
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        }
        console.log('[SignupSession] Set trip ID:', tripId);
    } catch (error) {
        console.error('[SignupSession] Error setting trip ID:', error);
    }
};

/**
 * Get selected trip ID
 */
export const getSelectedTripId = (): string | null => {
    try {
        return sessionStorage.getItem(TRIP_ID_KEY);
    } catch (error) {
        console.error('[SignupSession] Error getting trip ID:', error);
        return null;
    }
};

/**
 * Get trip type label
 */
export const getTripTypeLabel = (type: TripType): string => {
    const labels: Record<TripType, string> = {
        surprise: 'Surprise Me',
        group: 'Group Trip',
        standard: 'Standard Package',
        custom: 'Custom Trip',
    };
    return labels[type] || type;
};

/**
 * Get trip type description
 */
export const getTripTypeDescription = (type: TripType): string => {
    const descriptions: Record<TripType, string> = {
        surprise: 'Let us plan a mystery adventure tailored just for you',
        group: 'Join a curated group of travelers on fixed dates',
        standard: 'Choose from our ready-made travel packages',
        custom: 'Design your perfect trip with full flexibility',
    };
    return descriptions[type] || '';
};
