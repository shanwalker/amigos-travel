import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Palmtree, Mountain, Building2, TreePine, Waves,
  Utensils, Bike, Landmark, PartyPopper, Sparkle, Camera,
  Wallet, PiggyBank, Sparkles, Crown,
  User, Heart, Users, Baby,
  Hotel, Building, Star, Castle, Home,
  Coffee, Footprints, Rocket,
  ChevronLeft, ChevronRight, Check, Loader2,
  ArrowRight
} from 'lucide-react';
import type { TravelPreferences } from '@/integrations/supabase/database.types';

interface QuizOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  color?: string;
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
    title: "Dream Scenery?",
    subtitle: "Select your vibe",
    multiSelect: true,
    key: 'interests',
    options: [
      { value: 'beaches', label: 'Beaches', icon: <Palmtree className="w-5 h-5" />, color: 'from-blue-400 to-cyan-300' },
      { value: 'mountains', label: 'Mountains', icon: <Mountain className="w-5 h-5" />, color: 'from-emerald-400 to-teal-300' },
      { value: 'cities', label: 'Cities', icon: <Building2 className="w-5 h-5" />, color: 'from-purple-400 to-pink-300' },
      { value: 'countryside', label: 'Nature', icon: <TreePine className="w-5 h-5" />, color: 'from-green-400 to-lime-300' },
      { value: 'islands', label: 'Islands', icon: <Waves className="w-5 h-5" />, color: 'from-cyan-400 to-blue-300' },
    ]
  },
  {
    title: "Your Activities?",
    subtitle: "What do you love?",
    multiSelect: true,
    key: 'interests',
    options: [
      { value: 'food_tours', label: 'Foodie', icon: <Utensils className="w-5 h-5" />, color: 'from-orange-400 to-red-300' },
      { value: 'adventure', label: 'Action', icon: <Bike className="w-5 h-5" />, color: 'from-red-400 to-orange-300' },
      { value: 'culture', label: 'History', icon: <Landmark className="w-5 h-5" />, color: 'from-amber-400 to-yellow-300' },
      { value: 'nightlife', label: 'Party', icon: <PartyPopper className="w-5 h-5" />, color: 'from-pink-400 to-rose-300' },
      { value: 'relaxation', label: 'Relax', icon: <Sparkle className="w-5 h-5" />, color: 'from-indigo-400 to-violet-300' },
      { value: 'photography', label: 'Photos', icon: <Camera className="w-5 h-5" />, color: 'from-sky-400 to-blue-300' },
    ]
  },
  {
    title: "Budget Style?",
    subtitle: "Per day range",
    multiSelect: false,
    key: 'budget_style',
    options: [
      { value: 'budget_backpacker', label: 'Budget', icon: <Wallet className="w-5 h-5" />, description: '<₹3K', color: 'from-green-400 to-emerald-300' },
      { value: 'smart_saver', label: 'Saver', icon: <PiggyBank className="w-5 h-5" />, description: '₹3K-7K', color: 'from-blue-400 to-indigo-300' },
      { value: 'comfort_seeker', label: 'Comfort', icon: <Sparkles className="w-5 h-5" />, description: '₹7K-15K', color: 'from-purple-400 to-fuchsia-300' },
      { value: 'luxury_lover', label: 'Luxury', icon: <Crown className="w-5 h-5" />, description: '₹15K+', color: 'from-amber-400 to-yellow-300' },
    ]
  },
  {
    title: "Travel Squad?",
    subtitle: "Who's coming?",
    multiSelect: false,
    key: 'travel_style',
    options: [
      { value: 'solo', label: 'Solo', icon: <User className="w-5 h-5" />, color: 'from-blue-400 to-cyan-300' },
      { value: 'couple', label: 'Couple', icon: <Heart className="w-5 h-5" />, color: 'from-rose-400 to-pink-300' },
      { value: 'friends', label: 'Friends', icon: <Users className="w-5 h-5" />, color: 'from-violet-400 to-purple-300' },
      { value: 'family', label: 'Family', icon: <Baby className="w-5 h-5" />, color: 'from-green-400 to-teal-300' },
    ]
  },
  {
    title: "Stay Style?",
    subtitle: "Your vibe",
    multiSelect: false,
    key: 'accommodation_pref',
    options: [
      { value: 'hostels', label: 'Hostel', icon: <Hotel className="w-5 h-5" />, color: 'from-orange-400 to-amber-300' },
      { value: 'budget_hotels', label: 'Basic', icon: <Building className="w-5 h-5" />, color: 'from-blue-400 to-cyan-300' },
      { value: 'mid_range', label: 'Comfort', icon: <Star className="w-5 h-5" />, color: 'from-purple-400 to-indigo-300' },
      { value: 'luxury', label: 'Luxury', icon: <Castle className="w-5 h-5" />, color: 'from-amber-400 to-yellow-300' },
      { value: 'unique_stays', label: 'Unique', icon: <Home className="w-5 h-5" />, color: 'from-pink-400 to-rose-300' },
    ]
  },
  {
    title: "Pace?",
    subtitle: "Energy level",
    multiSelect: false,
    key: 'activity_level',
    options: [
      { value: 'chill', label: 'Chill', icon: <Coffee className="w-5 h-5" />, color: 'from-teal-400 to-green-300' },
      { value: 'moderate', label: 'Balanced', icon: <Footprints className="w-5 h-5" />, color: 'from-blue-400 to-indigo-300' },
      { value: 'active', label: 'Active', icon: <Rocket className="w-5 h-5" />, color: 'from-orange-400 to-red-300' },
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
  const queryClient = useQueryClient();

  const step = QUIZ_STEPS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_STEPS.length) * 100;

  useEffect(() => {
    // Preload images or heavy assets if needed
  }, []);

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
      // Auto-advance for single select after a short delay for better UX
      // setTimeout(() => handleNext(), 300); // Optional: disabled to allow changing mind
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

      // CRITICAL FIX: Invalidate the needs-onboarding query cache
      // This ensures ProtectedRoute sees the updated preferences immediately
      await queryClient.invalidateQueries({ queryKey: ['needs-onboarding', user.id] });
      await queryClient.invalidateQueries({ queryKey: ['profile', user.id] });

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

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background blobs for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md w-[95%] h-full max-h-[800px] flex flex-col"
      >
        <Card className="flex-1 flex flex-col border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden rounded-[2rem]">

          {/* Header Section - Compact */}
          <div className="px-6 pt-6 pb-2 shrink-0 z-10">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="rounded-full hover:bg-white/5 text-muted-foreground w-8 h-8"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex flex-col items-center">
                <span className="text-xs font-medium text-primary/80 tracking-wider uppercase">
                  Step {currentStep + 1}/{QUIZ_STEPS.length}
                </span>
                <div className="w-12 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  onComplete?.();
                  navigate('/dashboard');
                }}
                className="rounded-full hover:bg-white/5 text-muted-foreground w-8 h-8 opacity-50 hover:opacity-100"
              >
                <span className="text-xs">Skip</span>
              </Button>
            </div>

            <div className="text-center">
              <motion.h2
                key={step.title}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-display font-medium text-white mb-1"
              >
                {step.title}
              </motion.h2>
              <motion.p
                key={step.subtitle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-gray-400"
              >
                {step.subtitle}
              </motion.p>
            </div>
          </div>

          {/* Main Content - Scrollable if absolutely needed but designed to fit */}
          <div className="flex-1 px-4 py-2 overflow-y-auto no-scrollbar scroll-smooth">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full flex flex-col justify-center"
              >
                <div className="grid grid-cols-2 gap-3 pb-4">
                  {step.options.map((option, i) => {
                    const selected = isSelected(option.value);
                    return (
                      <motion.button
                        key={option.value}
                        custom={i}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleSelect(option.value)}
                        className={`
                          relative group p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 aspect-[4/3]
                          ${selected
                            ? 'border-transparent bg-white/10'
                            : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                          }
                        `}
                      >
                        {/* Glowing Gradient Border on Select */}
                        {selected && (
                          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${option.color || 'from-primary to-purple-500'} opacity-20 blur-xl`} />
                        )}
                        {selected && (
                          <motion.div
                            layoutId="outline"
                            className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br ${option.color || 'from-primary to-purple-500'} [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)]`}
                            style={{ WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}
                          />
                        )}

                        <div className={`
                           p-2 rounded-xl transition-all duration-300
                           ${selected ? 'scale-110' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}
                         `}>
                          {/* Icon with gradient text color if possible or just white */}
                          <div className={selected ? 'text-white drop-shadow-glow' : 'text-gray-300'}>
                            {option.icon}
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <span className={`text-sm font-medium tracking-wide ${selected ? 'text-white' : 'text-gray-400'}`}>
                            {option.label}
                          </span>
                          {option.description && (
                            <span className={`text-[10px] ${selected ? 'text-gray-300' : 'text-gray-500'}`}>
                              {option.description}
                            </span>
                          )}
                        </div>

                        {selected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white text-black flex items-center justify-center"
                          >
                            <Check className="w-2.5 h-2.5" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer - Fixed Action Button */}
          <div className="p-6 bg-gradient-to-t from-black/80 to-transparent shrink-0">
            <Button
              onClick={isLastStep ? handleComplete : handleNext}
              disabled={!canContinue() || saving}
              className={`
                    w-full h-14 rounded-2xl font-medium text-lg shadow-lg transition-all duration-300
                    ${isLastStep
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/25'
                }
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <span className="flex items-center gap-2">
                  {isLastStep ? 'Start Adventure' : 'Continue'}
                  {!isLastStep && <ArrowRight className="w-5 h-5 stroke-[2.5]" />}
                </span>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingQuiz;
