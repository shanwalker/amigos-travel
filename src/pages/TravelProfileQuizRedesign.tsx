import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { saveQuizResponse } from '@/lib/supabase/quiz';
import { QuizLayout } from '@/components/quiz/redesign/QuizLayout';
import { StepPersonality } from '@/components/quiz/redesign/StepPersonality';
import { StepInterests } from '@/components/quiz/redesign/StepInterests';
import { StepDuration } from '@/components/quiz/redesign/StepDuration';
import { StepDate } from '@/components/quiz/redesign/StepDate';
import { StepBudget } from '@/components/quiz/redesign/StepBudget';
import { StepTravelStyle } from '@/components/quiz/redesign/StepTravelStyle';
import { StepRegions } from '@/components/quiz/redesign/StepRegions';
import { StepAvoid } from '@/components/quiz/redesign/StepAvoid';
import { StepEmail } from '@/components/quiz/redesign/StepEmail';
import { Button } from '@/components/ui/button';

// --- DATA CONSTANTS (Re-declared for self-containment/cleanliness) ---

const personalities = [
    { id: 'relaxer', title: 'The Relaxer', description: 'Beach vibes, spa days, and slow mornings', emoji: '🏖️', color: 'from-blue-400 to-cyan-400' },
    { id: 'explorer', title: 'The Explorer', description: 'Hidden gems, local experiences, off the beaten path', emoji: '🗺️', color: 'from-green-400 to-emerald-400' },
    { id: 'culture_seeker', title: 'The Culture Seeker', description: 'Museums, history, art, and local traditions', emoji: '🎭', color: 'from-purple-400 to-pink-400' },
    { id: 'night_owl', title: 'The Night Owl', description: 'Nightlife, parties, and vibrant city scenes', emoji: '🌃', color: 'from-orange-400 to-red-400' },
];

const interests = [
    { id: 'culture', label: 'Culture', emoji: '🏛️' },
    { id: 'adventure', label: 'Adventure', emoji: '🏔️' },
    { id: 'food', label: 'Foodie', emoji: '🍜' },
    { id: 'nature', label: 'Nature', emoji: '🌿' },
    { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
    { id: 'nightlife', label: 'Nightlife', emoji: '🎉' },
    { id: 'wellness', label: 'Wellness', emoji: '🧘' },
    { id: 'photography', label: 'Photos', emoji: '📸' },
    { id: 'beaches', label: 'Beaches', emoji: '🏖️' },
    { id: 'luxury', label: 'Luxury', emoji: '💎' },
];

const durations = [
    { id: '3-5', label: '3-5 Days', subtitle: 'Quick getaway' },
    { id: '5-7', label: '5-7 Days', subtitle: 'Perfect week' },
    { id: '7-10', label: '7-10 Days', subtitle: 'Extended trip' },
    { id: '10+', label: '10+ Days', subtitle: 'Epic adventure' },
];

const budgetRanges = [
    { id: 'budget', label: '20k - 40k', min: 20000, max: 40000, subtitle: 'Budget-friendly' },
    { id: 'moderate', label: '40k - 70k', min: 40000, max: 70000, subtitle: 'Comfortable' },
    { id: 'premium', label: '70k - 1L', min: 70000, max: 100000, subtitle: 'Premium' },
    { id: 'luxury', label: '1L+', min: 100000, max: 500000, subtitle: 'Luxury' },
];

const travelStyles = [
    { id: 'solo', label: 'Solo', emoji: '🎒', description: 'Just me, myself, and I' },
    { id: 'couple', label: 'Couple', emoji: '💑', description: 'Romantic getaway for two' },
    { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', description: 'Quality time with loved ones' },
    { id: 'friends', label: 'Friends', emoji: '👯', description: 'Squad goals' },
    { id: 'group', label: 'Group', emoji: '👥', description: 'Join fellow travelers' },
];

const destinationRegions = [
    { id: 'domestic', label: 'India', emoji: '🇮🇳' },
    { id: 'asia', label: 'Asia', emoji: '🌏' },
    { id: 'europe', label: 'Europe', emoji: '🇪🇺' },
    { id: 'americas', label: 'Americas', emoji: '🌎' },
    { id: 'africa', label: 'Africa', emoji: '🌍' },
    { id: 'oceania', label: 'Oceania', emoji: '🦘' },
    { id: 'no-preference', label: 'Anywhere', emoji: '🌐' },
];

const commonExclusions = [
    { id: 'very-cold', label: 'Freezing Cold', emoji: '❄️' },
    { id: 'very-hot', label: 'Extreme Heat', emoji: '🔥' },
    { id: 'high-altitude', label: 'High Altitude', emoji: '⛰️' },
    { id: 'beaches', label: 'Beaches', emoji: '🏖️' },
    { id: 'deserts', label: 'Deserts', emoji: '🏜️' },
    { id: 'crowded', label: 'Crowds', emoji: '👥' },
    { id: 'remote', label: 'Remote', emoji: '🏝️' },
    { id: 'long-flights', label: 'Long Flights', emoji: '✈️' },
];

// --- MAIN COMPONENT ---

const RedesignedQuiz = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [profile, setProfile] = useState<any>({
        personality: '',
        interests: [],
        duration: '',
        travelDateType: undefined,
        preferredMonth: undefined,
        budget: undefined,
        travelStyle: '',
        destinationRegions: [],
        placesToAvoid: [],
        email: '',
        name: ''
    });

    const navigate = useNavigate();
    const { toast } = useToast();
    const totalSteps = 9;

    // --- NAVIGATION HANDLERS ---

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(c => c + 1);
        } else {
            // Shouldn't reach here usually given Submit is on Step 9
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(c => c - 1);
    };

    // --- SELECTION HANDLERS ---

    const handlePersonalitySelect = (id: string) => {
        setProfile({ ...profile, personality: id });
        setTimeout(handleNext, 400);
    };

    const handleInterestToggle = (id: string) => {
        const current = profile.interests || [];
        const updated = current.includes(id) ? current.filter((i: string) => i !== id) : [...current, id];
        setProfile({ ...profile, interests: updated });
    };

    const handleDurationSelect = (id: string) => {
        setProfile({ ...profile, duration: id });
        setTimeout(handleNext, 400);
    };

    const handleDateTypeSelect = (type: string) => {
        setProfile({ ...profile, travelDateType: type });
        if (type === 'flexible' || type === 'specific') {
            setTimeout(handleNext, 400);
        }
    };

    const handleMonthSelect = (month: string) => {
        setProfile({ ...profile, preferredMonth: month });
        setTimeout(handleNext, 400);
    };

    const handleBudgetSelect = (budget: any) => {
        setProfile({ ...profile, budget });
        setTimeout(handleNext, 400);
    };

    const handleTravelStyleSelect = (id: string) => {
        setProfile({ ...profile, travelStyle: id });
        setTimeout(handleNext, 400);
    };

    const handleRegionToggle = (id: string) => {
        const current = profile.destinationRegions || [];
        // If "No Preference" is selected, clear others. If others selected, clear "No Preference".
        let updated: string[] = [];

        if (id === 'no-preference') {
            updated = current.includes('no-preference') ? [] : ['no-preference'];
        } else {
            const others = current.filter((i: string) => i !== 'no-preference');
            updated = others.includes(id) ? others.filter((i: string) => i !== id) : [...others, id];
        }

        setProfile({ ...profile, destinationRegions: updated });
    };

    const handleAvoidToggle = (id: string) => {
        const current = profile.placesToAvoid || [];
        const updated = current.includes(id) ? current.filter((i: string) => i !== id) : [...current, id];
        setProfile({ ...profile, placesToAvoid: updated });
    };

    const handleEmailUpdate = (field: string, value: string) => {
        setProfile({ ...profile, [field]: value });
    }

    // --- SUBMISSION ---

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Determine result type purely based on random for now (or basic logic) since matching engine detailed logic is backend side or complex
            // For this UI demo, we route to 'matched' mostly.
            const resultType = 'matched';
            const finalProfile = { ...profile, resultType };

            const result = await saveQuizResponse(finalProfile);

            if (result.success) {
                localStorage.setItem('quizProfile', JSON.stringify(finalProfile));

                toast({
                    title: "Trip plan ready!",
                    description: "We've generated your personalized travel recommendation.",
                });

                // Simulate "processing" time for effect
                setTimeout(() => {
                    navigate('/quiz/result/matched');
                }, 800);
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            console.error('Submission error:', error);
            toast({ title: "Error", description: "Failed to save results. Please try again.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDER ---
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepPersonality options={personalities} selectedValue={profile.personality} onSelect={handlePersonalitySelect} />;
            case 2:
                return <StepInterests options={interests} selectedValues={profile.interests} onToggle={handleInterestToggle} onNext={handleNext} />;
            case 3:
                return <StepDuration options={durations} selectedValue={profile.duration} onSelect={handleDurationSelect} />;
            case 4:
                return <StepDate dateType={profile.travelDateType} preferredMonth={profile.preferredMonth} onSelectType={handleDateTypeSelect} onSelectMonth={handleMonthSelect} />;
            case 5:
                return <StepBudget options={budgetRanges} selectedBudget={profile.budget} onSelect={handleBudgetSelect} />;
            case 6:
                return <StepTravelStyle options={travelStyles} selectedValue={profile.travelStyle} onSelect={handleTravelStyleSelect} />;
            case 7:
                return <StepRegions options={destinationRegions} selectedValues={profile.destinationRegions} onToggle={handleRegionToggle} onNext={handleNext} />;
            case 8:
                return <StepAvoid options={commonExclusions} selectedValues={profile.placesToAvoid} onToggle={handleAvoidToggle} onNext={handleNext} />;
            case 9:
                return <StepEmail email={profile.email} name={profile.name} onUpdate={handleEmailUpdate} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <QuizLayout currentStep={currentStep} totalSteps={totalSteps} onBack={handleBack}>
            {renderStep()}
        </QuizLayout>
    );
};

export default RedesignedQuiz;
