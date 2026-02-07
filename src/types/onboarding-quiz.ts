// ============================================
// ONBOARDING QUIZ TYPE DEFINITIONS
// ============================================

export type TravelCompanion = 'solo' | 'couple' | 'family' | 'friends' | 'open_group';
export type PassportNationality = 'indian' | 'other';
export type DestinationPreference = 'in_mind' | 'open';
export type ExperiencePace = 'slow' | 'balanced' | 'full';
export type TripDuration = '3-5' | '6-9' | '10-14' | 'flexible';
export type BudgetRange = 'budget' | 'mid-range' | 'luxury' | 'flexible';
export type PlanningDatesType = 'fixed' | 'flexible';
export type AmigoRole = 'match_trips' | 'custom_plan' | 'match_travelers';
export type DestinationKnowledge = 'tell_me' | 'surprise' | 'open_both';
export type TravelVibe = 'relaxer' | 'explorer' | 'culture_seeker' | 'night_owl' | 'nature_lover' | 'bit_of_everything';
export type CompletionStatus = 'incomplete' | 'completed' | 'submitted';

export type TripStyle =
    | 'relaxed'
    | 'adventure'
    | 'culture'
    | 'nature'
    | 'food'
    | 'wellness'
    | 'party'
    | 'photography';

export type HardNoActivity =
    | 'paragliding'
    | 'scuba_diving'
    | 'long_walks'
    | 'hiking'
    | 'water_sports'
    | 'extreme_sports'
    | 'camping'
    | 'night_activities';

export type FoodPreference =
    | 'vegetarian'
    | 'vegan'
    | 'non_veg'
    | 'indian_only'
    | 'try_local'
    | 'allergies';

export type HealthCondition =
    | 'fear_of_heights'
    | 'cannot_swim'
    | 'mobility_limitations'
    | 'fear_of_animals'
    | 'claustrophobia'
    | 'motion_sickness';

export interface SpecificDates {
    start?: string;
    end?: string;
}

// Main quiz state interface
export interface OnboardingQuizState {
    // Meta
    sessionId: string;
    currentStep: number;
    completionStatus: CompletionStatus;
    quizVersion: string;

    // Phase A: Identity & Logistics
    travelCompanion: TravelCompanion | null;
    departureLocation: string;
    passportNationality: PassportNationality | null;
    destinationPreference: DestinationPreference | null;
    desiredDestinations: string[];
    placesToAvoid: string[];

    // Phase B: Style & Constraints
    tripStyles: TripStyle[];
    experiencePace: ExperiencePace | null;
    hardNoActivities: HardNoActivity[];
    foodPreferences: FoodPreference[];
    healthConditions: HealthCondition[];

    // Phase C: Budget & Timing
    tripDuration: TripDuration | null;
    budgetRange: BudgetRange | null;
    planningDatesType: PlanningDatesType | null;
    specificDates: SpecificDates;
    amigoRole: AmigoRole | null;
    destinationKnowledge: DestinationKnowledge | null;
    additionalNotes: string;
    travelVibe: TravelVibe | null;

    // Timestamps
    createdAt: string;
    updatedAt: string;
    submittedAt?: string;
}

// Database record interface
export interface OnboardingQuizRecord {
    id: string;
    user_id: string | null;
    session_id: string;

    travel_companion: TravelCompanion | null;
    departure_location: string | null;
    passport_nationality: PassportNationality | null;
    destination_preference: DestinationPreference | null;
    desired_destinations: string[];
    places_to_avoid: string[];

    trip_styles: TripStyle[];
    experience_pace: ExperiencePace | null;
    hard_no_activities: HardNoActivity[];
    food_preferences: FoodPreference[];
    health_conditions: HealthCondition[];

    trip_duration: TripDuration | null;
    budget_range: BudgetRange | null;
    planning_dates_type: PlanningDatesType | null;
    specific_dates: SpecificDates;
    amigo_role: AmigoRole | null;
    destination_knowledge: DestinationKnowledge | null;
    additional_notes: string | null;
    travel_vibe: TravelVibe | null;

    quiz_version: string;
    completion_status: CompletionStatus;
    current_step: number;
    created_at: string;
    updated_at: string;
    submitted_at: string | null;
    is_submitted: boolean;
    linked_surprise_request_id?: string;
    admin_reviewed?: boolean;
}

// Step configuration
export interface QuizStepConfig {
    id: number;
    key: string;
    title: string;
    subtitle?: string;
    phase: 'A' | 'B' | 'C';
    isRequired: boolean;
    isConditional?: boolean;
    conditionField?: keyof OnboardingQuizState;
    conditionValue?: any;
}

// Quiz step definitions
export const QUIZ_STEPS: QuizStepConfig[] = [
    // Phase A: Identity & Logistics
    { id: 1, key: 'travelCompanion', title: 'Who are you travelling with?', phase: 'A', isRequired: true },
    { id: 2, key: 'departureLocation', title: 'Which city will you start your trip from?', phase: 'A', isRequired: true },
    { id: 3, key: 'passportNationality', title: 'Which nationality passport do you travel with?', phase: 'A', isRequired: true },
    { id: 4, key: 'destinationPreference', title: 'Where would you like to go next?', phase: 'A', isRequired: true },
    { id: 5, key: 'desiredDestinations', title: 'Select your dream destinations', subtitle: 'Choose up to 5 countries', phase: 'A', isRequired: false, isConditional: true, conditionField: 'destinationPreference', conditionValue: 'in_mind' },
    { id: 6, key: 'placesToAvoid', title: 'Any places you want to avoid?', phase: 'A', isRequired: false },

    // Phase B: Style & Constraints  
    { id: 7, key: 'tripStyles', title: 'What kind of trip do you enjoy most?', subtitle: 'Select up to 3', phase: 'B', isRequired: true },
    { id: 8, key: 'experiencePace', title: 'What\'s your travel experience preference?', phase: 'B', isRequired: true },
    { id: 9, key: 'hardNoActivities', title: 'Anything you\'d like us to avoid?', subtitle: 'The "Hard No" filter', phase: 'B', isRequired: false },
    { id: 10, key: 'foodPreferences', title: 'Tell us about your food preferences', phase: 'B', isRequired: false },
    { id: 11, key: 'healthConditions', title: 'Any conditions we should know about?', phase: 'B', isRequired: false },

    // Phase C: Budget & Timing
    { id: 12, key: 'tripDuration', title: 'How long do you want to travel?', phase: 'C', isRequired: true },
    { id: 13, key: 'budgetRange', title: 'What\'s your budget range per person?', phase: 'C', isRequired: true },
    { id: 14, key: 'planningDatesType', title: 'When are you planning to travel?', phase: 'C', isRequired: true },
    { id: 15, key: 'amigoRole', title: 'How can Travel Amigo help you?', phase: 'C', isRequired: true },
    { id: 16, key: 'destinationKnowledge', title: 'Do you want to know the destination?', phase: 'C', isRequired: true },
    { id: 17, key: 'travelVibe', title: 'What\'s your travel vibe?', subtitle: 'The visual vibe check', phase: 'C', isRequired: true },
];

// Total steps count
export const TOTAL_STEPS = QUIZ_STEPS.length;

// Default initial state
export const getInitialQuizState = (): OnboardingQuizState => ({
    sessionId: generateSessionId(),
    currentStep: 1,
    completionStatus: 'incomplete',
    quizVersion: 'v2.0',

    travelCompanion: null,
    departureLocation: '',
    passportNationality: null,
    destinationPreference: null,
    desiredDestinations: [],
    placesToAvoid: [],

    tripStyles: [],
    experiencePace: null,
    hardNoActivities: [],
    foodPreferences: [],
    healthConditions: [],

    tripDuration: null,
    budgetRange: null,
    planningDatesType: null,
    specificDates: {},
    amigoRole: null,
    destinationKnowledge: null,
    additionalNotes: '',
    travelVibe: null,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
});

// Generate unique session ID
function generateSessionId(): string {
    return `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Convert state to database record format
export function stateToRecord(state: OnboardingQuizState, userId?: string): Partial<OnboardingQuizRecord> {
    return {
        user_id: userId || null,
        session_id: state.sessionId,
        travel_companion: state.travelCompanion,
        departure_location: state.departureLocation || null,
        passport_nationality: state.passportNationality,
        destination_preference: state.destinationPreference,
        desired_destinations: state.desiredDestinations,
        places_to_avoid: state.placesToAvoid,
        trip_styles: state.tripStyles,
        experience_pace: state.experiencePace,
        hard_no_activities: state.hardNoActivities,
        food_preferences: state.foodPreferences,
        health_conditions: state.healthConditions,
        trip_duration: state.tripDuration,
        budget_range: state.budgetRange,
        planning_dates_type: state.planningDatesType,
        specific_dates: state.specificDates,
        amigo_role: state.amigoRole,
        destination_knowledge: state.destinationKnowledge,
        additional_notes: state.additionalNotes || null,
        travel_vibe: state.travelVibe,
        quiz_version: state.quizVersion,
        completion_status: state.completionStatus,
        current_step: state.currentStep,
        is_submitted: state.completionStatus === 'submitted' || state.completionStatus === 'completed',
    };
}

// Convert database record to state format
export function recordToState(record: OnboardingQuizRecord): OnboardingQuizState {
    return {
        sessionId: record.session_id,
        currentStep: record.current_step,
        completionStatus: record.completion_status,
        quizVersion: record.quiz_version,

        travelCompanion: record.travel_companion,
        departureLocation: record.departure_location || '',
        passportNationality: record.passport_nationality,
        destinationPreference: record.destination_preference,
        desiredDestinations: record.desired_destinations || [],
        placesToAvoid: record.places_to_avoid || [],

        tripStyles: record.trip_styles || [],
        experiencePace: record.experience_pace,
        hardNoActivities: record.hard_no_activities || [],
        foodPreferences: record.food_preferences || [],
        healthConditions: record.health_conditions || [],

        tripDuration: record.trip_duration,
        budgetRange: record.budget_range,
        planningDatesType: record.planning_dates_type,
        specificDates: record.specific_dates || {},
        amigoRole: record.amigo_role,
        destinationKnowledge: record.destination_knowledge,
        additionalNotes: record.additional_notes || '',
        travelVibe: record.travel_vibe,

        createdAt: record.created_at,
        updatedAt: record.updated_at,
        submittedAt: record.submitted_at || undefined,
    };
}

// Option data for quiz steps
export const COMPANION_OPTIONS: { value: TravelCompanion; label: string; emoji: string; description: string }[] = [
    { value: 'solo', label: 'Just Me', emoji: '🎒', description: 'Solo adventure' },
    { value: 'couple', label: 'Couple', emoji: '💑', description: 'Romantic getaway' },
    { value: 'family', label: 'My Family', emoji: '👨‍👩‍👧‍👦', description: 'Family vacation' },
    { value: 'friends', label: 'My Friends', emoji: '👯', description: 'Friend trip' },
    { value: 'open_group', label: 'Open to Group Travel', emoji: '🌍', description: 'Meet new amigos' },
];

export const PASSPORT_OPTIONS: { value: PassportNationality; label: string; emoji: string }[] = [
    { value: 'indian', label: 'Indian Passport', emoji: '🇮🇳' },
    { value: 'other', label: 'Other Passport', emoji: '🌐' },
];

export const DESTINATION_PREF_OPTIONS: { value: DestinationPreference; label: string; emoji: string; description: string }[] = [
    { value: 'in_mind', label: 'I have places in mind', emoji: '🗺️', description: 'Let me choose specific destinations' },
    { value: 'open', label: 'I\'m open to anywhere', emoji: '✨', description: 'Surprise me with the best options' },
];

export const TRIP_STYLE_OPTIONS: { value: TripStyle; label: string; emoji: string }[] = [
    { value: 'relaxed', label: 'Relaxed', emoji: '🏖️' },
    { value: 'adventure', label: 'Adventure', emoji: '🏔️' },
    { value: 'culture', label: 'Culture', emoji: '🏛️' },
    { value: 'nature', label: 'Nature', emoji: '🌲' },
    { value: 'food', label: 'Food', emoji: '🍜' },
    { value: 'wellness', label: 'Wellness', emoji: '🧘' },
    { value: 'party', label: 'Party', emoji: '🎉' },
    { value: 'photography', label: 'Photography', emoji: '📸' },
];

export const PACE_OPTIONS: { value: ExperiencePace; label: string; description: string }[] = [
    { value: 'slow', label: 'Slow & Relaxed', description: 'Take it easy, no rush' },
    { value: 'balanced', label: 'Balanced', description: 'Mix of activities and rest' },
    { value: 'full', label: 'Full & Busy', description: 'Pack in as much as possible' },
];

export const HARD_NO_OPTIONS: { value: HardNoActivity; label: string; emoji: string }[] = [
    { value: 'paragliding', label: 'Paragliding', emoji: '🪂' },
    { value: 'scuba_diving', label: 'Scuba Diving', emoji: '🤿' },
    { value: 'long_walks', label: 'Long Walks', emoji: '🚶' },
    { value: 'hiking', label: 'Hiking', emoji: '🥾' },
    { value: 'water_sports', label: 'Water Sports', emoji: '🏄' },
    { value: 'extreme_sports', label: 'Extreme Sports', emoji: '🎿' },
    { value: 'camping', label: 'Camping', emoji: '⛺' },
    { value: 'night_activities', label: 'Night Activities', emoji: '🌙' },
];

export const FOOD_OPTIONS: { value: FoodPreference; label: string; emoji: string }[] = [
    { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
    { value: 'vegan', label: 'Vegan', emoji: '🌱' },
    { value: 'non_veg', label: 'Non-Vegetarian', emoji: '🍗' },
    { value: 'indian_only', label: 'Indian Food Only', emoji: '🍛' },
    { value: 'try_local', label: 'Happy to Try Local', emoji: '🍜' },
    { value: 'allergies', label: 'Have Allergies', emoji: '⚠️' },
];

export const HEALTH_OPTIONS: { value: HealthCondition; label: string; emoji: string }[] = [
    { value: 'fear_of_heights', label: 'Fear of Heights', emoji: '🏔️' },
    { value: 'cannot_swim', label: 'Cannot Swim', emoji: '🏊' },
    { value: 'mobility_limitations', label: 'Mobility Limitations', emoji: '♿' },
    { value: 'fear_of_animals', label: 'Fear of Animals', emoji: '🐾' },
    { value: 'claustrophobia', label: 'Claustrophobia', emoji: '📦' },
    { value: 'motion_sickness', label: 'Motion Sickness', emoji: '🎢' },
];

export const DURATION_OPTIONS: { value: TripDuration; label: string; subtitle: string }[] = [
    { value: '3-5', label: '3-5 Days', subtitle: 'Quick getaway' },
    { value: '6-9', label: '6-9 Days', subtitle: 'Perfect week' },
    { value: '10-14', label: '10-14 Days', subtitle: 'Extended adventure' },
    { value: 'flexible', label: 'Flexible', subtitle: 'Open to suggestions' },
];

export const BUDGET_OPTIONS: { value: BudgetRange; label: string; description: string; emoji: string }[] = [
    { value: 'budget', label: 'Budget', description: 'Smart spending', emoji: '💰' },
    { value: 'mid-range', label: 'Mid-Range', description: 'Comfortable travel', emoji: '💳' },
    { value: 'luxury', label: 'Luxury', description: 'Premium experiences', emoji: '💎' },
    { value: 'flexible', label: 'Flexible', description: 'Depends on the trip', emoji: '🎯' },
];

export const DATES_TYPE_OPTIONS: { value: PlanningDatesType; label: string; description: string }[] = [
    { value: 'fixed', label: 'Fixed Dates', description: 'I know when I want to travel' },
    { value: 'flexible', label: 'Flexible', description: 'I\'m open to suggestions' },
];

export const AMIGO_ROLE_OPTIONS: { value: AmigoRole; label: string; description: string; emoji: string }[] = [
    { value: 'match_trips', label: 'Match me with trips', description: 'Show me existing trip packages', emoji: '🎯' },
    { value: 'custom_plan', label: 'Build a custom plan', description: 'Create a personalized itinerary', emoji: '✨' },
    { value: 'match_travelers', label: 'Match with other travelers', description: 'Find travel buddies', emoji: '🤝' },
];

export const DESTINATION_KNOWLEDGE_OPTIONS: { value: DestinationKnowledge; label: string; description: string; emoji: string }[] = [
    { value: 'tell_me', label: 'Tell me the destination', description: 'I want to know where I\'m going', emoji: '🗺️' },
    { value: 'surprise', label: 'Surprise me', description: 'Keep it a mystery!', emoji: '🎁' },
    { value: 'open_both', label: 'Open to both', description: 'Dealer\'s choice', emoji: '🎲' },
];

export const VIBE_OPTIONS: { value: TravelVibe; label: string; description: string; emoji: string; color: string }[] = [
    { value: 'relaxer', label: 'The Relaxer', description: 'Beach vibes, spa days, slow mornings', emoji: '🏖️', color: 'from-blue-400 to-cyan-400' },
    { value: 'explorer', label: 'The Explorer', description: 'Hidden gems, off-beat paths', emoji: '🧭', color: 'from-amber-400 to-orange-500' },
    { value: 'culture_seeker', label: 'The Culture Seeker', description: 'Museums, history, local traditions', emoji: '🏛️', color: 'from-purple-400 to-pink-500' },
    { value: 'night_owl', label: 'The Night Owl', description: 'Nightlife, parties, late adventures', emoji: '🦉', color: 'from-indigo-500 to-purple-600' },
    { value: 'nature_lover', label: 'The Nature Lover', description: 'Mountains, forests, wildlife', emoji: '🌲', color: 'from-green-400 to-emerald-500' },
    { value: 'bit_of_everything', label: 'A Bit of Everything', description: 'Why choose? I want it all!', emoji: '🌈', color: 'from-pink-400 via-purple-400 to-indigo-400' },
];

// Popular departure cities
export const POPULAR_CITIES = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi',
    'Goa', 'Guwahati', 'Bhubaneswar', 'Indore', 'Nagpur', 'Coimbatore'
];

// Popular destination countries
export const POPULAR_DESTINATIONS = [
    { name: 'Thailand', emoji: '🇹🇭', region: 'Southeast Asia' },
    { name: 'Bali, Indonesia', emoji: '🇮🇩', region: 'Southeast Asia' },
    { name: 'Vietnam', emoji: '🇻🇳', region: 'Southeast Asia' },
    { name: 'Japan', emoji: '🇯🇵', region: 'East Asia' },
    { name: 'South Korea', emoji: '🇰🇷', region: 'East Asia' },
    { name: 'Maldives', emoji: '🇲🇻', region: 'South Asia' },
    { name: 'Sri Lanka', emoji: '🇱🇰', region: 'South Asia' },
    { name: 'Nepal', emoji: '🇳🇵', region: 'South Asia' },
    { name: 'Dubai, UAE', emoji: '🇦🇪', region: 'Middle East' },
    { name: 'Turkey', emoji: '🇹🇷', region: 'Middle East' },
    { name: 'Greece', emoji: '🇬🇷', region: 'Europe' },
    { name: 'Italy', emoji: '🇮🇹', region: 'Europe' },
    { name: 'France', emoji: '🇫🇷', region: 'Europe' },
    { name: 'Spain', emoji: '🇪🇸', region: 'Europe' },
    { name: 'Switzerland', emoji: '🇨🇭', region: 'Europe' },
    { name: 'Australia', emoji: '🇦🇺', region: 'Oceania' },
    { name: 'New Zealand', emoji: '🇳🇿', region: 'Oceania' },
    { name: 'Singapore', emoji: '🇸🇬', region: 'Southeast Asia' },
    { name: 'Malaysia', emoji: '🇲🇾', region: 'Southeast Asia' },
    { name: 'Philippines', emoji: '🇵🇭', region: 'Southeast Asia' },
];

// Places to avoid suggestions
export const AVOID_SUGGESTIONS = [
    'Anywhere too cold',
    'Anywhere too hot',
    'High altitude places',
    'Crowded tourist spots',
    'Remote/isolated areas',
    'Long-haul destinations',
];
