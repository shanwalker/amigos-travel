import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Palmtree, Mountain, Building2, TreePine, Waves,
  Utensils, Bike, Landmark, PartyPopper, Sparkle, Camera,
  Wallet, PiggyBank, Sparkles, Crown,
  User, Heart, Users, Baby,
  Hotel, Building, Star, Castle, Home,
  Coffee, Footprints, Rocket,
  ChevronLeft, ChevronRight, Check, Loader2
} from 'lucide-react';
import type { TravelPreferences } from '@/integrations/supabase/database.types';

interface QuizOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface QuizStep {
  title: string;
  subtitle: string;
  options: QuizOption[];
  multiSelect: boolean;
  key: keyof TravelPreferences;
}

const QUIZ_STEPS: QuizStep[] = [
  {
    title: "What kind of places excite you?",
    subtitle: "Pick all that make your heart race",
    multiSelect: true,
    key: 'interests',
    options: [
      { value: 'beaches', label: 'Beaches', icon: <Palmtree className="w-6 h-6" />, description: 'Sun, sand & surf' },
      { value: 'mountains', label: 'Mountains', icon: <Mountain className="w-6 h-6" />, description: 'Peaks & trails' },
      { value: 'cities', label: 'Cities', icon: <Building2 className="w-6 h-6" />, description: 'Urban vibes' },
      { value: 'countryside', label: 'Countryside', icon: <TreePine className="w-6 h-6" />, description: 'Peaceful escapes' },
      { value: 'islands', label: 'Islands', icon: <Waves className="w-6 h-6" />, description: 'Paradise awaits' },
    ]
  },
  {
    title: "What activities do you love?",
    subtitle: "Select your favorite ways to explore",
    multiSelect: true,
    key: 'interests',
    options: [
      { value: 'food_tours', label: 'Food Tours', icon: <Utensils className="w-6 h-6" />, description: 'Local flavors' },
      { value: 'adventure', label: 'Adventure Sports', icon: <Bike className="w-6 h-6" />, description: 'Thrills & adrenaline' },
      { value: 'culture', label: 'Cultural Sites', icon: <Landmark className="w-6 h-6" />, description: 'History & heritage' },
      { value: 'nightlife', label: 'Nightlife', icon: <PartyPopper className="w-6 h-6" />, description: 'Party scenes' },
      { value: 'relaxation', label: 'Relaxation/Spa', icon: <Sparkle className="w-6 h-6" />, description: 'Unwind & rejuvenate' },
      { value: 'photography', label: 'Photography', icon: <Camera className="w-6 h-6" />, description: 'Capture moments' },
    ]
  },
  {
    title: "What's your travel budget style?",
    subtitle: "No judgment here – everyone's got their vibe!",
    multiSelect: false,
    key: 'budget_style',
    options: [
      { value: 'budget_backpacker', label: 'Budget Backpacker', icon: <Wallet className="w-6 h-6" />, description: 'Under ₹3K/day' },
      { value: 'smart_saver', label: 'Smart Saver', icon: <PiggyBank className="w-6 h-6" />, description: '₹3K-7K/day' },
      { value: 'comfort_seeker', label: 'Comfort Seeker', icon: <Sparkles className="w-6 h-6" />, description: '₹7K-15K/day' },
      { value: 'luxury_lover', label: 'Luxury Lover', icon: <Crown className="w-6 h-6" />, description: '₹15K+/day' },
    ]
  },
  {
    title: "Who do you travel with?",
    subtitle: "Your usual squad",
    multiSelect: false,
    key: 'travel_style',
    options: [
      { value: 'solo', label: 'Solo Explorer', icon: <User className="w-6 h-6" />, description: 'Me, myself & I' },
      { value: 'couple', label: 'Couple/Partner', icon: <Heart className="w-6 h-6" />, description: 'Romantic getaways' },
      { value: 'friends', label: 'Friends Group', icon: <Users className="w-6 h-6" />, description: 'Squad goals' },
      { value: 'family', label: 'Family', icon: <Baby className="w-6 h-6" />, description: 'All ages welcome' },
    ]
  },
  {
    title: "Your accommodation preference?",
    subtitle: "Where you lay your head matters",
    multiSelect: false,
    key: 'accommodation_pref',
    options: [
      { value: 'hostels', label: 'Hostels/Dorms', icon: <Hotel className="w-6 h-6" />, description: 'Social & budget-friendly' },
      { value: 'budget_hotels', label: 'Budget Hotels', icon: <Building className="w-6 h-6" />, description: 'Simple & clean' },
      { value: 'mid_range', label: 'Mid-range Hotels', icon: <Star className="w-6 h-6" />, description: 'Comfort & value' },
      { value: 'luxury', label: 'Luxury Resorts', icon: <Castle className="w-6 h-6" />, description: 'Treat yourself' },
      { value: 'unique_stays', label: 'Unique Stays', icon: <Home className="w-6 h-6" />, description: 'Airbnb & boutiques' },
    ]
  },
  {
    title: "How active are you on trips?",
    subtitle: "Your energy level while exploring",
    multiSelect: false,
    key: 'activity_level',
    options: [
      { value: 'chill', label: 'Chill & Relax', icon: <Coffee className="w-6 h-6" />, description: 'Take it slow' },
      { value: 'moderate', label: 'Moderately Active', icon: <Footprints className="w-6 h-6" />, description: 'Balance is key' },
      { value: 'active', label: 'Very Active', icon: <Rocket className="w-6 h-6" />, description: 'Go go go!' },
    ]
  },
];

interface OnboardingQuizProps {
  onComplete?: () => void;
}

export const OnboardingQuiz = ({ onComplete }: OnboardingQuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({
    interests: [],
    budget_style: '',
    travel_style: '',
    accommodation_pref: '',
    activity_level: '',
    dietary: [],
  });
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const step = QUIZ_STEPS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_STEPS.length) * 100;

  const handleSelect = (value: string) => {
    if (step.multiSelect) {
      const currentValues = answers[step.key] as string[];
      if (currentValues.includes(value)) {
        setAnswers(prev => ({
          ...prev,
          [step.key]: currentValues.filter(v => v !== value)
        }));
      } else {
        setAnswers(prev => ({
          ...prev,
          [step.key]: [...currentValues, value]
        }));
      }
    } else {
      setAnswers(prev => ({
        ...prev,
        [step.key]: value
      }));
    }
  };

  const isSelected = (value: string) => {
    if (step.multiSelect) {
      return (answers[step.key] as string[]).includes(value);
    }
    return answers[step.key] === value;
  };

  const canContinue = () => {
    const answer = answers[step.key];
    if (step.multiSelect) {
      return (answer as string[]).length > 0;
    }
    return answer !== '';
  };

  const handleNext = () => {
    if (currentStep < QUIZ_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const preferences: TravelPreferences = {
        interests: answers.interests as string[],
        budget_style: answers.budget_style as TravelPreferences['budget_style'],
        travel_style: answers.travel_style as TravelPreferences['travel_style'],
        accommodation_pref: answers.accommodation_pref as TravelPreferences['accommodation_pref'],
        activity_level: answers.activity_level as TravelPreferences['activity_level'],
        dietary: answers.dietary as string[],
        completed_at: new Date().toISOString(),
      };

      const { error } = await (supabase as any)
        .from('profiles')
        .update({ travel_preferences: preferences })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Preferences saved! Let\'s find your perfect trip!');
      onComplete?.();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const isLastStep = currentStep === QUIZ_STEPS.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-navy-medium to-navy-deep flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-border/50 bg-card/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <div className="p-4 border-b border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {QUIZ_STEPS.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Question Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-display text-foreground mb-2">
                    {step.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {step.subtitle}
                  </p>
                </div>

                {/* Options Grid */}
                <div className={`grid gap-3 ${step.options.length > 4 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2'}`}>
                  {step.options.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(option.value)}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-200
                        ${isSelected(option.value)
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                          : 'border-border/50 bg-background/50 hover:border-primary/50 hover:bg-background/80'
                        }
                      `}
                    >
                      {isSelected(option.value) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </motion.div>
                      )}
                      <div className="flex flex-col items-center text-center gap-2">
                        <div className={`
                          p-3 rounded-full transition-colors
                          ${isSelected(option.value) ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
                        `}>
                          {option.icon}
                        </div>
                        <span className={`font-medium ${isSelected(option.value) ? 'text-primary' : 'text-foreground'}`}>
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/30">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {isLastStep ? (
                <Button
                  onClick={handleComplete}
                  disabled={!canContinue() || saving}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canContinue()}
                  className="gap-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skip Option */}
        <div className="text-center mt-4">
          <button
            onClick={() => {
              onComplete?.();
              navigate('/dashboard');
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingQuiz;
