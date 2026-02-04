import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useQuizState, useQuizMigration } from '@/hooks/useQuizState';
import { useAuth } from '@/contexts/AuthContext';
import { QuizProgress } from './QuizProgress';
import { QuizNavigation } from './QuizNavigation';
import { StepTransition } from './StepTransition';
import {
    Step01TravelCompanion,
    Step02DepartureCity,
    Step03Passport,
    Step04DestinationChoice,
    Step05DesiredDestinations,
    Step06PlacesToAvoid,
    Step07TripStyles,
    Step08ExperiencePace,
    Step09HardNoActivities,
    Step10FoodPreferences,
    Step11HealthConditions,
    Step12TripDuration,
    Step13BudgetRange,
    Step14PlanningDates,
    Step15AmigoRole,
    Step16DestinationKnowledge,
    Step17TravelVibe,
} from './steps';
import { QuizAuthPrompt } from './QuizAuthPrompt';
import { QuizComplete } from './QuizComplete';

interface QuizContainerProps {
    onClose?: () => void;
    className?: string;
}

export function QuizContainer({ onClose, className }: QuizContainerProps) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { migrateQuizData, isMigrating } = useQuizMigration();

    const {
        state,
        currentStep,
        totalSteps,
        progress,
        isComplete,
        goToStep,
        nextStep,
        prevStep,
        canGoNext,
        canGoPrev,
        updateField,
        shouldShowStep,
        isStepValid,
        markComplete,
    } = useQuizState();

    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const [showComplete, setShowComplete] = useState(false);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const prevStepRef = useRef(currentStep);

    // Track direction
    useEffect(() => {
        if (currentStep > prevStepRef.current) {
            setDirection('forward');
        } else if (currentStep < prevStepRef.current) {
            setDirection('backward');
        }
        prevStepRef.current = currentStep;
    }, [currentStep]);

    // Handle step completion logic
    const handleNext = () => {
        // If on last step and quiz is valid
        if (currentStep === totalSteps && isStepValid(currentStep)) {
            if (user) {
                // User is logged in, submit directly
                markComplete();
                const completedState = {
                    ...state,
                    completionStatus: 'completed' as const,
                    submittedAt: new Date().toISOString()
                };
                migrateQuizData(completedState).then(() => {
                    setShowComplete(true);
                });
            } else {
                // Show auth prompt
                setShowAuthPrompt(true);
            }
        } else {
            nextStep();
        }
    };

    const handleAuthSuccess = async () => {
        setShowAuthPrompt(false);
        markComplete();
        const completedState = {
            ...state,
            completionStatus: 'completed' as const,
            submittedAt: new Date().toISOString()
        };
        await migrateQuizData(completedState);
        setShowComplete(true);
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            navigate('/');
        }
    };

    // Render current step
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step01TravelCompanion
                        value={state.travelCompanion}
                        onChange={(v) => updateField('travelCompanion', v)}
                    />
                );
            case 2:
                return (
                    <Step02DepartureCity
                        value={state.departureLocation}
                        onChange={(v) => updateField('departureLocation', v)}
                    />
                );
            case 3:
                return (
                    <Step03Passport
                        value={state.passportNationality}
                        onChange={(v) => updateField('passportNationality', v)}
                    />
                );
            case 4:
                return (
                    <Step04DestinationChoice
                        value={state.destinationPreference}
                        onChange={(v) => updateField('destinationPreference', v)}
                    />
                );
            case 5:
                // Conditional step - only show if user has places in mind
                if (!shouldShowStep(5)) {
                    // Skip to next step
                    goToStep(6);
                    return null;
                }
                return (
                    <Step05DesiredDestinations
                        value={state.desiredDestinations}
                        onChange={(v) => updateField('desiredDestinations', v)}
                        maxSelections={5}
                    />
                );
            case 6:
                return (
                    <Step06PlacesToAvoid
                        value={state.placesToAvoid}
                        onChange={(v) => updateField('placesToAvoid', v)}
                    />
                );
            case 7:
                return (
                    <Step07TripStyles
                        value={state.tripStyles}
                        onChange={(v) => updateField('tripStyles', v)}
                        maxSelections={3}
                    />
                );
            case 8:
                return (
                    <Step08ExperiencePace
                        value={state.experiencePace}
                        onChange={(v) => updateField('experiencePace', v)}
                    />
                );
            case 9:
                return (
                    <Step09HardNoActivities
                        value={state.hardNoActivities}
                        onChange={(v) => updateField('hardNoActivities', v)}
                    />
                );
            case 10:
                return (
                    <Step10FoodPreferences
                        value={state.foodPreferences}
                        onChange={(v) => updateField('foodPreferences', v)}
                    />
                );
            case 11:
                return (
                    <Step11HealthConditions
                        value={state.healthConditions}
                        onChange={(v) => updateField('healthConditions', v)}
                    />
                );
            case 12:
                return (
                    <Step12TripDuration
                        value={state.tripDuration}
                        onChange={(v) => updateField('tripDuration', v)}
                    />
                );
            case 13:
                return (
                    <Step13BudgetRange
                        value={state.budgetRange}
                        onChange={(v) => updateField('budgetRange', v)}
                    />
                );
            case 14:
                return (
                    <Step14PlanningDates
                        dateType={state.planningDatesType}
                        specificDates={state.specificDates}
                        onDateTypeChange={(v) => updateField('planningDatesType', v)}
                        onSpecificDatesChange={(v) => updateField('specificDates', v)}
                    />
                );
            case 15:
                return (
                    <Step15AmigoRole
                        value={state.amigoRole}
                        onChange={(v) => updateField('amigoRole', v)}
                    />
                );
            case 16:
                return (
                    <Step16DestinationKnowledge
                        value={state.destinationKnowledge}
                        onChange={(v) => updateField('destinationKnowledge', v)}
                    />
                );
            case 17:
                return (
                    <Step17TravelVibe
                        value={state.travelVibe}
                        onChange={(v) => updateField('travelVibe', v)}
                    />
                );
            default:
                return null;
        }
    };

    // Show completion screen
    if (showComplete) {
        return <QuizComplete onClose={handleClose} vibeType={state.travelVibe} />;
    }

    return (
        <div className={cn(
            "min-h-screen bg-gradient-to-br from-navy-deep via-navy-deep to-[#0a1628] flex flex-col",
            className
        )}>
            {/* Background Pattern */}
            <div
                className="fixed inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Header */}
            <header className="relative z-10 px-3 sm:px-6 py-1 sm:py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-primary to-orange-500 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-navy-deep" />
                        </div>
                        <div>
                            <h1 className="font-bold text-white text-sm sm:text-lg font-jakarta">Travel Amigo</h1>
                            <p className="text-white/50 text-[10px] sm:text-xs leading-none">Dream trip planner</p>
                        </div>
                    </div>

                    <motion.button
                        onClick={handleClose}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X className="w-4 h-4 text-white/60" />
                    </motion.button>
                </div>
            </header>

            {/* Progress */}
            <div className="px-3 sm:px-6 py-0 sm:py-4">
                <div className="max-w-4xl mx-auto">
                    <QuizProgress
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                    />
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col px-3 sm:px-6 py-0 sm:py-6 relative z-10 overflow-hidden">
                <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
                    {/* Step Content */}
                    <div className="flex-1 flex items-center justify-center py-0 sm:py-4">
                        <StepTransition stepKey={currentStep} direction={direction}>
                            {renderStep()}
                        </StepTransition>
                    </div>
                </div>
            </main>

            {/* Navigation */}
            <footer className="relative z-10 px-3 sm:px-6 py-2 sm:py-6 bg-gradient-to-t from-navy-deep to-transparent">
                <div className="max-w-4xl mx-auto">
                    <QuizNavigation
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        canGoNext={isStepValid(currentStep)}
                        canGoPrev={canGoPrev}
                        isLoading={isMigrating}
                        onNext={handleNext}
                        onPrev={prevStep}
                        nextLabel={currentStep === totalSteps ? (user ? 'Submit Quiz' : 'Continue to Sign Up') : undefined}
                    />
                </div>
            </footer>

            {/* Auth Prompt Modal */}
            <AnimatePresence>
                {showAuthPrompt && (
                    <QuizAuthPrompt
                        onSuccess={handleAuthSuccess}
                        onClose={() => setShowAuthPrompt(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default QuizContainer;
