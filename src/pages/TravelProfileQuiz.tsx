import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

// Quiz data types
interface QuizProfile {
    personality: string;
    interests: string[];
    duration: string;
    travelDateType?: 'specific' | 'flexible' | 'month'; // NEW
    preferredMonth?: string; // NEW
    specificDates?: { start: string; end: string }; // NEW
    budget: { min: number; max: number };
    travelStyle: string;
    destinationRegions?: string[]; // NEW
    placesToAvoid?: string[]; // NEW
    resultType: 'matched' | 'surprise' | 'custom';
    email?: string; // NEW - Required for lead capture
    phone?: string;
    name?: string;
}

// Step 1: Personality
const personalities = [
    {
        id: 'relaxer',
        title: 'The Relaxer',
        description: 'Beach vibes, spa days, and slow mornings',
        emoji: '🏖️',
        color: 'from-blue-400 to-cyan-400',
    },
    {
        id: 'explorer',
        title: 'The Explorer',
        description: 'Hidden gems, local experiences, off the beaten path',
        emoji: '🗺️',
        color: 'from-green-400 to-emerald-400',
    },
    {
        id: 'culture_seeker',
        title: 'The Culture Seeker',
        description: 'Museums, history, art, and local traditions',
        emoji: '🎭',
        color: 'from-purple-400 to-pink-400',
    },
    {
        id: 'night_owl',
        title: 'The Night Owl',
        description: 'Nightlife, parties, and vibrant city scenes',
        emoji: '🌃',
        color: 'from-orange-400 to-red-400',
    },
];

// Step 2: Interests
const interests = [
    { id: 'culture', label: 'Culture & Heritage', emoji: '🏛️' },
    { id: 'adventure', label: 'Adventure Sports', emoji: '🏔️' },
    { id: 'food', label: 'Food & Cuisine', emoji: '🍜' },
    { id: 'nature', label: 'Nature & Wildlife', emoji: '🌿' },
    { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
    { id: 'nightlife', label: 'Nightlife', emoji: '🎉' },
    { id: 'wellness', label: 'Wellness & Spa', emoji: '🧘' },
    { id: 'photography', label: 'Photography', emoji: '📸' },
];

// Step 3: Duration
const durations = [
    { id: '3-5', label: '3-5 Days', subtitle: 'Quick getaway' },
    { id: '5-7', label: '5-7 Days', subtitle: 'Perfect week' },
    { id: '7-10', label: '7-10 Days', subtitle: 'Extended trip' },
    { id: '10+', label: '10+ Days', subtitle: 'Epic adventure' },
];

// Step 3.5: Travel Dates (NEW - from requirements)
const travelDateOptions = [
    { id: 'specific', label: 'I have specific dates', description: 'I know exactly when I want to travel' },
    { id: 'flexible', label: 'I\'m flexible', description: 'Any time in the next 3-6 months works' },
    { id: 'month', label: 'Specific month', description: 'I prefer a particular month' },
];

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Step 4: Budget (in ₹)
const budgetRanges = [
    { id: 'budget', label: '₹20,000 - ₹40,000', min: 20000, max: 40000, subtitle: 'Budget-friendly' },
    { id: 'moderate', label: '₹40,000 - ₹70,000', min: 40000, max: 70000, subtitle: 'Comfortable' },
    { id: 'premium', label: '₹70,000 - ₹1,00,000', min: 70000, max: 100000, subtitle: 'Premium' },
    { id: 'luxury', label: '₹1,00,000+', min: 100000, max: 500000, subtitle: 'Luxury' },
];

// Step 5: Travel Style
const travelStyles = [
    { id: 'solo', label: 'Solo', emoji: '🎒', description: 'Just me, myself, and I' },
    { id: 'couple', label: 'Couple', emoji: '💑', description: 'Romantic getaway for two' },
    { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', description: 'Quality time with loved ones' },
    { id: 'friends', label: 'Friends', emoji: '👯', description: 'Squad goals' },
    { id: 'group', label: 'Group', emoji: '👥', description: 'Join like-minded travelers' },
];

// Step 5.5: Destination Preferences (NEW - from requirements)
const destinationRegions = [
    { id: 'domestic', label: 'Domestic (India)', emoji: '🇮🇳' },
    { id: 'asia', label: 'Asia', emoji: '🌏' },
    { id: 'europe', label: 'Europe', emoji: '🇪🇺' },
    { id: 'americas', label: 'Americas', emoji: '🌎' },
    { id: 'africa', label: 'Africa', emoji: '🌍' },
    { id: 'oceania', label: 'Oceania', emoji: '🦘' },
    { id: 'no-preference', label: 'No Preference', emoji: '🌐' },
];

// Common places people might want to avoid (for surprise trips)
const commonExclusions = [
    'Very cold destinations',
    'Very hot destinations',
    'High altitude places',
    'Beach destinations',
    'Desert areas',
    'Crowded tourist spots',
    'Remote/isolated areas',
];

const TravelProfileQuiz = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [profile, setProfile] = useState<Partial<QuizProfile>>({
        interests: [],
        destinationRegions: [],
        placesToAvoid: [],
    });
    const navigate = useNavigate();
    const { toast } = useToast();

    const totalSteps = 9; // Updated: 1=Personality, 2=Interests, 3=Duration, 4=Dates, 5=Budget, 6=Style, 7=Regions, 8=Exclusions, 9=Result Type
    const progress = (currentStep / totalSteps) * 100;

    // Load saved progress from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('travelQuizProgress');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setProfile(parsed.profile);
                setCurrentStep(parsed.step);
            } catch (e) {
                console.error('Failed to load quiz progress', e);
            }
        }
    }, []);

    // Save progress to localStorage
    useEffect(() => {
        if (currentStep > 1) {
            localStorage.setItem('travelQuizProgress', JSON.stringify({
                profile,
                step: currentStep,
            }));
        }
    }, [profile, currentStep]);

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePersonalitySelect = (personalityId: string) => {
        setProfile({ ...profile, personality: personalityId });
        setTimeout(handleNext, 300);
    };

    const handleInterestToggle = (interestId: string) => {
        const current = profile.interests || [];
        const updated = current.includes(interestId)
            ? current.filter(i => i !== interestId)
            : [...current, interestId];
        setProfile({ ...profile, interests: updated });
    };

    const handleDurationSelect = (durationId: string) => {
        setProfile({ ...profile, duration: durationId });
        setTimeout(handleNext, 300);
    };

    const handleBudgetSelect = (budget: { min: number; max: number }) => {
        setProfile({ ...profile, budget });
        setTimeout(handleNext, 300);
    };

    const handleTravelStyleSelect = (styleId: string) => {
        setProfile({ ...profile, travelStyle: styleId });
        setTimeout(handleNext, 300);
    };

    const handleResultTypeSelect = (type: 'matched' | 'surprise' | 'custom') => {
        const updatedProfile = { ...profile, resultType: type };
        setProfile(updatedProfile);

        // Save to localStorage before navigating
        localStorage.setItem('quizProfile', JSON.stringify(updatedProfile));

        // Navigate to appropriate result page
        setTimeout(() => {
            if (type === 'matched') {
                navigate('/quiz/result/matched');
            } else if (type === 'surprise') {
                navigate('/quiz/result/surprise');
            } else {
                navigate('/quiz/result/custom');
            }
        }, 300);
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return !!profile.personality;
            case 2:
                return (profile.interests?.length || 0) > 0;
            case 3:
                return !!profile.duration;
            case 4:
                return !!profile.budget;
            case 5:
                return !!profile.travelStyle;
            default:
                return true;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar currentVersion="v1" onVersionChange={() => { }} />

            <div className="container mx-auto px-6 py-12 max-w-4xl">
                {/* Progress Header */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-muted-foreground">
                            Question {currentStep} of {totalSteps}
                        </h2>
                        <span className="text-sm font-semibold text-primary">
                            {Math.round(progress)}% Complete
                        </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Quiz Steps */}
                <AnimatePresence mode="wait">
                    {/* Step 1: Personality */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                                What best describes your travel personality?
                            </h1>
                            <p className="text-lg text-muted-foreground mb-12">
                                Choose the one that resonates with you the most
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                {personalities.map((p) => (
                                    <motion.button
                                        key={p.id}
                                        onClick={() => handlePersonalitySelect(p.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`relative p-8 rounded-2xl border-2 text-left transition-all ${profile.personality === p.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50 bg-card'
                                            }`}
                                    >
                                        <div className={`text-5xl mb-4 bg-gradient-to-br ${p.color} bg-clip-text`}>
                                            {p.emoji}
                                        </div>
                                        <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                                            {p.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {p.description}
                                        </p>
                                        {profile.personality === p.id && (
                                            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                                <Check className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Interests */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                                What are you interested in?
                            </h1>
                            <p className="text-lg text-muted-foreground mb-12">
                                Select all that apply (choose at least one)
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {interests.map((interest) => (
                                    <motion.button
                                        key={interest.id}
                                        onClick={() => handleInterestToggle(interest.id)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`relative p-6 rounded-xl border-2 text-center transition-all ${profile.interests?.includes(interest.id)
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50 bg-card'
                                            }`}
                                    >
                                        <div className="text-4xl mb-2">{interest.emoji}</div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {interest.label}
                                        </p>
                                        {profile.interests?.includes(interest.id) && (
                                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            <Button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                size="lg"
                                className="w-full md:w-auto"
                            >
                                Continue
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        </motion.div>
                    )}

                    {/* Step 3: Duration */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                                How long would you like to travel?
                            </h1>
                            <p className="text-lg text-muted-foreground mb-12">
                                Choose your ideal trip duration
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                {durations.map((d) => (
                                    <motion.button
                                        key={d.id}
                                        onClick={() => handleDurationSelect(d.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-8 rounded-2xl border-2 text-left transition-all ${profile.duration === d.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50 bg-card'
                                            }`}
                                    >
                                        <h3 className="font-serif text-3xl font-bold text-foreground mb-2">
                                            {d.label}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {d.subtitle}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Budget */}
                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                                What's your budget per person?
                            </h1>
                            <p className="text-lg text-muted-foreground mb-12">
                                Select your comfortable spending range
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                {budgetRanges.map((b) => (
                                    <motion.button
                                        key={b.id}
                                        onClick={() => handleBudgetSelect({ min: b.min, max: b.max })}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-8 rounded-2xl border-2 text-left transition-all ${profile.budget?.min === b.min
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50 bg-card'
                                            }`}
                                    >
                                        <h3 className="font-serif text-3xl font-bold text-foreground mb-2">
                                            {b.label}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {b.subtitle}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 5: Travel Style */}
                    {currentStep === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                                How would you like to travel?
                            </h1>
                            <p className="text-lg text-muted-foreground mb-12">
                                Choose your travel style
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                {travelStyles.map((style) => (
                                    <motion.button
                                        key={style.id}
                                        onClick={() => handleTravelStyleSelect(style.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-8 rounded-2xl border-2 text-left transition-all ${profile.travelStyle === style.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50 bg-card'
                                            }`}
                                    >
                                        <div className="text-5xl mb-4">{style.emoji}</div>
                                        <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                                            {style.label}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {style.description}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 6: Result Type (Branching Logic) */}
                    {currentStep === 6 && (
                        <motion.div
                            key="step6"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                                How would you like your result?
                            </h1>
                            <p className="text-lg text-muted-foreground mb-12">
                                Choose your adventure path
                            </p>

                            <div className="space-y-6">
                                <motion.button
                                    onClick={() => handleResultTypeSelect('matched')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full p-8 rounded-2xl border-2 border-border hover:border-primary bg-card text-left transition-all group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-5xl">🎯</div>
                                        <div className="flex-1">
                                            <h3 className="font-serif text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                                Show me my perfect match
                                            </h3>
                                            <p className="text-muted-foreground">
                                                We'll find the best trip that matches your preferences and show you all the details
                                            </p>
                                        </div>
                                        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </motion.button>

                                <motion.button
                                    onClick={() => handleResultTypeSelect('surprise')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full p-8 rounded-2xl border-2 border-border hover:border-primary bg-card text-left transition-all group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-5xl">🎁</div>
                                        <div className="flex-1">
                                            <h3 className="font-serif text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                                Surprise me!
                                            </h3>
                                            <p className="text-muted-foreground">
                                                Keep the destination a mystery until closer to your trip. Trust us to plan something amazing!
                                            </p>
                                        </div>
                                        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </motion.button>

                                <motion.button
                                    onClick={() => handleResultTypeSelect('custom')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full p-8 rounded-2xl border-2 border-border hover:border-primary bg-card text-left transition-all group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-5xl">✨</div>
                                        <div className="flex-1">
                                            <h3 className="font-serif text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                                I want a custom trip
                                            </h3>
                                            <p className="text-muted-foreground">
                                                Work with our travel experts to create a completely personalized itinerary just for you
                                            </p>
                                        </div>
                                        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                {currentStep < 6 && (
                    <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            size="lg"
                        >
                            <ChevronLeft className="mr-2 w-5 h-5" />
                            Back
                        </Button>

                        {currentStep === 2 && (
                            <Button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                size="lg"
                            >
                                Continue
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default TravelProfileQuiz;
