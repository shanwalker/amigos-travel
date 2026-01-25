/**
 * Session Storage Manager for Pre-Signup Flow
 * Manages questionnaire data and profile info before user creates account
 */

export type TripTypeSelection = 'surprise' | 'group' | 'custom' | 'standard';

export interface QuestionnaireAnswers {
  // Common fields
  interests?: string[];
  budget_min?: number;
  budget_max?: number;
  budget_style?: string;
  travel_style?: string;
  accommodation_pref?: string;
  activity_level?: string;
  preferred_dates?: string;
  flexible_dates?: boolean;
  
  // Surprise Trip specific
  activities?: string[];
  special_requests?: string;
  
  // Custom Trip specific
  destination_ideas?: string[];
  num_travelers?: number;
  special_requirements?: string;
  
  // Group Trip specific
  selected_trip_id?: string;
  
  // Meta
  [key: string]: unknown;
}

export interface PreSignupProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

export interface SignupSessionData {
  tripType: TripTypeSelection;
  questionnaireAnswers: QuestionnaireAnswers;
  profileData: PreSignupProfileData | null;
  selectedTripId?: string;
  sourcePage: string;
  createdAt: string;
  expiresAt: string;
  currentStep: number;
  completedSteps: number[];
}

const STORAGE_KEY = 'travelamigo_signup_session';
const SESSION_DURATION_HOURS = 24;

/**
 * Create a new signup session
 */
export const createSignupSession = (
  tripType: TripTypeSelection,
  sourcePage: string = '/'
): SignupSessionData => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_HOURS * 60 * 60 * 1000);
  
  const session: SignupSessionData = {
    tripType,
    questionnaireAnswers: {},
    profileData: null,
    sourcePage,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    currentStep: 0,
    completedSteps: [],
  };
  
  saveSignupSession(session);
  return session;
};

/**
 * Save session to sessionStorage
 */
export const saveSignupSession = (session: SignupSessionData): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save signup session:', error);
  }
};

/**
 * Get current session from sessionStorage
 */
export const getSignupSession = (): SignupSessionData | null => {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const session: SignupSessionData = JSON.parse(data);
    
    // Check if session has expired
    if (new Date(session.expiresAt) < new Date()) {
      clearSignupSession();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Failed to get signup session:', error);
    return null;
  }
};

/**
 * Update questionnaire answers
 */
export const updateQuestionnaireAnswers = (
  answers: Partial<QuestionnaireAnswers>
): SignupSessionData | null => {
  const session = getSignupSession();
  if (!session) return null;
  
  session.questionnaireAnswers = {
    ...session.questionnaireAnswers,
    ...answers,
  };
  
  saveSignupSession(session);
  return session;
};

/**
 * Update profile data
 */
export const updateProfileData = (
  data: Partial<PreSignupProfileData>
): SignupSessionData | null => {
  const session = getSignupSession();
  if (!session) return null;
  
  session.profileData = {
    ...session.profileData,
    ...data,
  } as PreSignupProfileData;
  
  saveSignupSession(session);
  return session;
};

/**
 * Update current step
 */
export const updateCurrentStep = (step: number): SignupSessionData | null => {
  const session = getSignupSession();
  if (!session) return null;
  
  session.currentStep = step;
  if (!session.completedSteps.includes(step - 1) && step > 0) {
    session.completedSteps.push(step - 1);
  }
  
  saveSignupSession(session);
  return session;
};

/**
 * Set selected trip ID (for group trips)
 */
export const setSelectedTripId = (tripId: string): SignupSessionData | null => {
  const session = getSignupSession();
  if (!session) return null;
  
  session.selectedTripId = tripId;
  session.questionnaireAnswers.selected_trip_id = tripId;
  
  saveSignupSession(session);
  return session;
};

/**
 * Clear the signup session
 */
export const clearSignupSession = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear signup session:', error);
  }
};

/**
 * Check if there's a pending signup session
 */
export const hasPendingSignupSession = (): boolean => {
  return getSignupSession() !== null;
};

/**
 * Get trip type label for display
 */
export const getTripTypeLabel = (type: TripTypeSelection): string => {
  const labels: Record<TripTypeSelection, string> = {
    surprise: 'Surprise Trip',
    group: 'Group Trip',
    custom: 'Custom Trip',
    standard: 'Standard Trip',
  };
  return labels[type];
};

/**
 * Get trip type description
 */
export const getTripTypeDescription = (type: TripTypeSelection): string => {
  const descriptions: Record<TripTypeSelection, string> = {
    surprise: 'Let us plan a mystery adventure based on your preferences',
    group: 'Join a curated group experience with fellow travelers',
    custom: 'Design your perfect itinerary with our travel experts',
    standard: 'Browse and book from our collection of ready trips',
  };
  return descriptions[type];
};

/**
 * Prepare data for database insertion after signup
 */
export const prepareForDatabaseInsert = () => {
  const session = getSignupSession();
  if (!session) return null;
  
  return {
    tripType: session.tripType,
    questionnaireAnswers: session.questionnaireAnswers,
    profileData: session.profileData,
    selectedTripId: session.selectedTripId,
    signupContext: {
      trip_type: session.tripType,
      selected_trip_id: session.selectedTripId,
      questionnaire_completed_at: new Date().toISOString(),
      source_page: session.sourcePage,
    },
  };
};
