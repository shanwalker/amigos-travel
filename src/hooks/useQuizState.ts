import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    OnboardingQuizState,
    getInitialQuizState,
    QUIZ_STEPS,
    TOTAL_STEPS,
    CompletionStatus
} from '@/types/onboarding-quiz';

const STORAGE_KEY = 'travel_amigo_quiz_state';
const STORAGE_VERSION = 'v2.0';

interface UseQuizStateReturn {
    state: OnboardingQuizState;
    currentStep: number;
    totalSteps: number;
    progress: number;
    isComplete: boolean;

    // Navigation
    goToStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    canGoNext: boolean;
    canGoPrev: boolean;

    // State updates
    updateField: <K extends keyof OnboardingQuizState>(field: K, value: OnboardingQuizState[K]) => void;
    updateFields: (fields: Partial<OnboardingQuizState>) => void;

    // Array field helpers
    toggleArrayItem: <T>(field: keyof OnboardingQuizState, item: T, maxItems?: number) => boolean;

    // Completion
    markComplete: () => void;
    resetQuiz: () => void;

    // Persistence
    isRestored: boolean;
    lastSaved: Date | null;

    // Step validation
    isStepValid: (step: number) => boolean;
    getStepConfig: (step: number) => typeof QUIZ_STEPS[0] | undefined;
    shouldShowStep: (step: number) => boolean;
}

export function useQuizState(): UseQuizStateReturn {
    const { user } = useAuth();
    const [state, setState] = useState<OnboardingQuizState>(getInitialQuizState);
    const [isRestored, setIsRestored] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Restore state from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);

                // Check version compatibility
                if (parsed.quizVersion === STORAGE_VERSION) {
                    setState(parsed);
                    console.log('[useQuizState] ✅ Restored quiz state from localStorage');
                } else {
                    console.log('[useQuizState] ⚠️ Version mismatch, starting fresh');
                    localStorage.removeItem(STORAGE_KEY);
                }
            }
        } catch (error) {
            console.error('[useQuizState] ❌ Error restoring state:', error);
            localStorage.removeItem(STORAGE_KEY);
        }
        setIsRestored(true);
    }, []);

    // Save state to localStorage with debounce
    const saveToStorage = useCallback((newState: OnboardingQuizState) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            try {
                const stateToSave = {
                    ...newState,
                    updatedAt: new Date().toISOString(),
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
                setLastSaved(new Date());
                console.log('[useQuizState] 💾 Saved to localStorage');
            } catch (error) {
                console.error('[useQuizState] ❌ Error saving state:', error);
            }
        }, 300); // Debounce 300ms
    }, []);

    // Update single field
    const updateField = useCallback(<K extends keyof OnboardingQuizState>(
        field: K,
        value: OnboardingQuizState[K]
    ) => {
        setState(prev => {
            const newState = { ...prev, [field]: value, updatedAt: new Date().toISOString() };
            saveToStorage(newState);
            return newState;
        });
    }, [saveToStorage]);

    // Update multiple fields
    const updateFields = useCallback((fields: Partial<OnboardingQuizState>) => {
        setState(prev => {
            const newState = { ...prev, ...fields, updatedAt: new Date().toISOString() };
            saveToStorage(newState);
            return newState;
        });
    }, [saveToStorage]);

    // Toggle item in array field
    const toggleArrayItem = useCallback(<T>(
        field: keyof OnboardingQuizState,
        item: T,
        maxItems?: number
    ): boolean => {
        let added = false;

        setState(prev => {
            const currentArray = (prev[field] as unknown as T[]) || [];
            let newArray: T[];

            if (currentArray.includes(item)) {
                newArray = currentArray.filter(i => i !== item);
                added = false;
            } else {
                // Check max items limit
                if (maxItems && currentArray.length >= maxItems) {
                    console.log(`[useQuizState] ⚠️ Max ${maxItems} items reached for ${String(field)}`);
                    return prev; // Don't add, return unchanged
                }
                newArray = [...currentArray, item];
                added = true;
            }

            const newState = {
                ...prev,
                [field]: newArray,
                updatedAt: new Date().toISOString()
            };
            saveToStorage(newState);
            return newState;
        });

        return added;
    }, [saveToStorage]);

    // Check if step should be shown (handles conditional steps)
    const shouldShowStep = useCallback((step: number): boolean => {
        const stepConfig = QUIZ_STEPS.find(s => s.id === step);
        if (!stepConfig) return false;

        if (!stepConfig.isConditional) return true;

        // Check condition
        if (stepConfig.conditionField && stepConfig.conditionValue !== undefined) {
            return state[stepConfig.conditionField] === stepConfig.conditionValue;
        }

        return true;
    }, [state]);

    // Get next valid step (skipping conditional steps that shouldn't show)
    const getNextValidStep = useCallback((currentStep: number): number => {
        let next = currentStep + 1;
        while (next <= TOTAL_STEPS && !shouldShowStep(next)) {
            next++;
        }
        return Math.min(next, TOTAL_STEPS);
    }, [shouldShowStep]);

    // Get previous valid step
    const getPrevValidStep = useCallback((currentStep: number): number => {
        let prev = currentStep - 1;
        while (prev >= 1 && !shouldShowStep(prev)) {
            prev--;
        }
        return Math.max(prev, 1);
    }, [shouldShowStep]);

    // Validate current step
    const isStepValid = useCallback((step: number): boolean => {
        const stepConfig = QUIZ_STEPS.find(s => s.id === step);
        if (!stepConfig) return false;
        if (!stepConfig.isRequired) return true;

        const key = stepConfig.key as keyof OnboardingQuizState;
        const value = state[key];

        // Check if value exists and is not empty
        if (value === null || value === undefined) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        if (Array.isArray(value) && value.length === 0) {
            // For array fields marked as required, they need at least one item
            return false;
        }

        return true;
    }, [state]);

    // Navigation functions
    const goToStep = useCallback((step: number) => {
        if (step >= 1 && step <= TOTAL_STEPS) {
            updateField('currentStep', step);
        }
    }, [updateField]);

    const nextStep = useCallback(() => {
        if (state.currentStep < TOTAL_STEPS) {
            const next = getNextValidStep(state.currentStep);
            updateField('currentStep', next);
        }
    }, [state.currentStep, getNextValidStep, updateField]);

    const prevStep = useCallback(() => {
        if (state.currentStep > 1) {
            const prev = getPrevValidStep(state.currentStep);
            updateField('currentStep', prev);
        }
    }, [state.currentStep, getPrevValidStep, updateField]);

    // Mark quiz as complete
    const markComplete = useCallback(() => {
        updateFields({
            completionStatus: 'completed' as CompletionStatus,
            submittedAt: new Date().toISOString(),
        });
    }, [updateFields]);

    // Reset quiz
    const resetQuiz = useCallback(() => {
        const freshState = getInitialQuizState();
        setState(freshState);
        localStorage.removeItem(STORAGE_KEY);
        console.log('[useQuizState] 🔄 Quiz reset');
    }, []);

    // Get step configuration
    const getStepConfig = useCallback((step: number) => {
        return QUIZ_STEPS.find(s => s.id === step);
    }, []);

    // Calculate progress
    const progress = Math.round((state.currentStep / TOTAL_STEPS) * 100);

    // Check if can navigate
    const canGoNext = state.currentStep < TOTAL_STEPS && isStepValid(state.currentStep);
    const canGoPrev = state.currentStep > 1;

    // Check if complete
    const isComplete = state.completionStatus === 'completed' || state.completionStatus === 'submitted';

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    return {
        state,
        currentStep: state.currentStep,
        totalSteps: TOTAL_STEPS,
        progress,
        isComplete,

        goToStep,
        nextStep,
        prevStep,
        canGoNext,
        canGoPrev,

        updateField,
        updateFields,
        toggleArrayItem,

        markComplete,
        resetQuiz,

        isRestored,
        lastSaved,

        isStepValid,
        getStepConfig,
        shouldShowStep,
    };
}

// Hook for migrating quiz data to database after authentication
export function useQuizMigration() {
    const { user } = useAuth();
    const [isMigrating, setIsMigrating] = useState(false);
    const [migrationError, setMigrationError] = useState<string | null>(null);
    const [migrationComplete, setMigrationComplete] = useState(false);

    const migrateQuizData = useCallback(async (manualState?: OnboardingQuizState): Promise<boolean> => {
        if (!user) {
            console.log('[useQuizMigration] ⚠️ No user, cannot migrate');
            return false;
        }

        try {
            setIsMigrating(true);
            setMigrationError(null);

            let quizState: OnboardingQuizState;

            if (manualState) {
                quizState = manualState;
            } else {
                // Get stored quiz data
                const stored = localStorage.getItem(STORAGE_KEY);
                if (!stored) {
                    console.log('[useQuizMigration] ℹ️ No quiz data to migrate');
                    setMigrationComplete(true);
                    return true;
                }
                quizState = JSON.parse(stored);
            }

            // Validate quiz is complete
            if (quizState.completionStatus !== 'completed') {
                console.log('[useQuizMigration] ⚠️ Quiz not complete, not migrating');
                return false;
            }

            // Import dynamically to avoid circular dependencies
            const { saveOnboardingQuiz } = await import('@/lib/supabase/onboarding-quiz');

            const result = await saveOnboardingQuiz(quizState, user.id);

            if (result.success) {
                // Clear localStorage after successful migration
                localStorage.removeItem(STORAGE_KEY);
                console.log('[useQuizMigration] ✅ Quiz data migrated successfully');
                setMigrationComplete(true);
                return true;
            } else {
                throw new Error(result.error || 'Migration failed');
            }
        } catch (error: any) {
            console.error('[useQuizMigration] ❌ Migration error:', error);
            setMigrationError(error.message);
            return false;
        } finally {
            setIsMigrating(false);
        }
    }, [user]);

    // Check for pending migration when user logs in
    useEffect(() => {
        if (user && !migrationComplete) {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    const quizState = JSON.parse(stored);
                    if (quizState.completionStatus === 'completed') {
                        console.log('[useQuizMigration] 🔄 Found completed quiz, initiating migration...');
                        migrateQuizData();
                    }
                } catch (e) {
                    // Ignore parse errors
                }
            }
        }
    }, [user, migrationComplete, migrateQuizData]);

    return {
        migrateQuizData,
        isMigrating,
        migrationError,
        migrationComplete,
    };
}

export default useQuizState;
