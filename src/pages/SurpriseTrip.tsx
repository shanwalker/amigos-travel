import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateSurpriseRequest } from '@/hooks/useSurpriseRequests';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Palmtree, Mountain, Building2, Waves, TreePine,
  Utensils, Bike, Landmark, PartyPopper, Sparkle, Camera,
  User, Heart, Users, Baby,
  Car, Footprints, UtensilsCrossed, Compass,
  CalendarIcon, ChevronLeft, ChevronRight, Check, Loader2,
  Sparkles, Gift, MapPin, Clock
} from 'lucide-react';

interface WizardOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
  type: 'budget' | 'multi-select' | 'single-select' | 'date' | 'text';
  options?: WizardOption[];
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'budget',
    title: "What's your budget range?",
    subtitle: "We'll find the perfect trip within your budget",
    type: 'budget',
  },
  {
    id: 'interests',
    title: "What places excite you?",
    subtitle: "Pick all that make your heart race",
    type: 'multi-select',
    options: [
      { value: 'beaches', label: 'Beaches', icon: <Palmtree className="w-5 h-5" />, description: 'Sun, sand & surf' },
      { value: 'mountains', label: 'Mountains', icon: <Mountain className="w-5 h-5" />, description: 'Peaks & trails' },
      { value: 'cities', label: 'Cities', icon: <Building2 className="w-5 h-5" />, description: 'Urban vibes' },
      { value: 'islands', label: 'Islands', icon: <Waves className="w-5 h-5" />, description: 'Paradise awaits' },
      { value: 'countryside', label: 'Countryside', icon: <TreePine className="w-5 h-5" />, description: 'Peaceful escapes' },
    ]
  },
  {
    id: 'travel_style',
    title: "Who are you traveling with?",
    subtitle: "This helps us tailor the experience",
    type: 'single-select',
    options: [
      { value: 'solo', label: 'Solo Explorer', icon: <User className="w-5 h-5" />, description: 'Me, myself & I' },
      { value: 'couple', label: 'Couple', icon: <Heart className="w-5 h-5" />, description: 'Romantic getaway' },
      { value: 'friends', label: 'Friends', icon: <Users className="w-5 h-5" />, description: 'Squad goals' },
      { value: 'family', label: 'Family', icon: <Baby className="w-5 h-5" />, description: 'All ages welcome' },
    ]
  },
  {
    id: 'activities',
    title: "What activities do you love?",
    subtitle: "Select your favorite ways to explore",
    type: 'multi-select',
    options: [
      { value: 'food_tours', label: 'Food Tours', icon: <Utensils className="w-5 h-5" />, description: 'Local flavors' },
      { value: 'adventure', label: 'Adventure', icon: <Bike className="w-5 h-5" />, description: 'Thrills & adrenaline' },
      { value: 'culture', label: 'Cultural Sites', icon: <Landmark className="w-5 h-5" />, description: 'History & heritage' },
      { value: 'nightlife', label: 'Nightlife', icon: <PartyPopper className="w-5 h-5" />, description: 'Party scenes' },
      { value: 'relaxation', label: 'Relaxation', icon: <Sparkle className="w-5 h-5" />, description: 'Unwind & rejuvenate' },
      { value: 'photography', label: 'Photography', icon: <Camera className="w-5 h-5" />, description: 'Capture moments' },
      { value: 'local_transport', label: 'Local Transport', icon: <Car className="w-5 h-5" />, description: 'Authentic travel' },
      { value: 'walking_tours', label: 'Walking Tours', icon: <Footprints className="w-5 h-5" />, description: 'Explore on foot' },
    ]
  },
  {
    id: 'dates',
    title: "When do you want to travel?",
    subtitle: "Pick your preferred dates or stay flexible",
    type: 'date',
  },
  {
    id: 'special_requests',
    title: "Any special requests?",
    subtitle: "Tell us anything else we should know",
    type: 'text',
  },
  {
    id: 'confirmation',
    title: "Ready for your surprise?",
    subtitle: "Review your preferences and submit",
    type: 'text',
  }
];

const SurpriseTrip = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [budgetRange, setBudgetRange] = useState([15000, 40000]);
  const [interests, setInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [flexibleDates, setFlexibleDates] = useState(true);
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const createSurpriseRequest = useCreateSurpriseRequest();

  const step = WIZARD_STEPS[currentStep];
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  const handleMultiSelect = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[]) => {
    if (current.includes(value)) {
      setter(current.filter(v => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  const canContinue = () => {
    switch (step.id) {
      case 'budget': return true;
      case 'interests': return interests.length > 0;
      case 'travel_style': return travelStyle !== '';
      case 'activities': return activities.length > 0;
      case 'dates': return flexibleDates || selectedDate;
      case 'special_requests': return true;
      case 'confirmation': return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please login to submit a surprise trip request');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await createSurpriseRequest.mutateAsync({
        user_id: user.id,
        interests_data: {
          interests,
          activities,
          travel_style: travelStyle,
          special_requests: specialRequests || null,
        },
        budget_min: budgetRange[0],
        budget_max: budgetRange[1],
        preferred_dates: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null,
        flexible_dates: flexibleDates,
        status: 'pending',
        matched_buddy_id: null,
        assigned_trip_id: null,
        admin_notes: null,
      });

      setSubmitted(true);
      toast.success('Your surprise trip request has been submitted!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-deep via-navy-medium to-navy-deep flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center">
            <Gift className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-display text-foreground mb-4">
            Your Surprise is Being Planned! 🎉
          </h1>
          <p className="text-muted-foreground mb-6">
            We're matching you with a local buddy and crafting the perfect trip based on your preferences. 
            You'll receive an email within 48 hours with your surprise destination!
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Go to Dashboard
            </Button>
            <Button onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isLastStep = currentStep === WIZARD_STEPS.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-navy-medium to-navy-deep py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Surprise Trip Wizard
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-foreground mb-2">
            Let Us Surprise You
          </h1>
          <p className="text-muted-foreground">
            Tell us your preferences, and we'll plan the perfect trip
          </p>
        </motion.div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {WIZARD_STEPS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Card */}
        <Card className="border-border/50 bg-card/90 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-display text-foreground mb-2">
                    {step.title}
                  </h2>
                  <p className="text-muted-foreground">{step.subtitle}</p>
                </div>

                {/* Step Content */}
                {step.id === 'budget' && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">
                        ₹{budgetRange[0].toLocaleString()} - ₹{budgetRange[1].toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">per person</p>
                    </div>
                    <Slider
                      value={budgetRange}
                      onValueChange={setBudgetRange}
                      min={5000}
                      max={100000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₹5,000</span>
                      <span>₹1,00,000</span>
                    </div>
                  </div>
                )}

                {(step.id === 'interests' || step.id === 'activities') && step.options && (
                  <div className={`grid gap-3 ${step.options.length > 5 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
                    {step.options.map((option) => {
                      const selected = step.id === 'interests' 
                        ? interests.includes(option.value)
                        : activities.includes(option.value);
                      return (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (step.id === 'interests') {
                              handleMultiSelect(option.value, setInterests, interests);
                            } else {
                              handleMultiSelect(option.value, setActivities, activities);
                            }
                          }}
                          className={`
                            relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                            ${selected
                              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                              : 'border-border/50 bg-background/50 hover:border-primary/50'
                            }
                          `}
                        >
                          {selected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </motion.div>
                          )}
                          <div className={`p-2 rounded-lg w-fit mb-2 ${selected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {option.icon}
                          </div>
                          <span className={`font-medium text-sm ${selected ? 'text-primary' : 'text-foreground'}`}>
                            {option.label}
                          </span>
                          {option.description && (
                            <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {step.id === 'travel_style' && step.options && (
                  <div className="grid grid-cols-2 gap-4">
                    {step.options.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTravelStyle(option.value)}
                        className={`
                          relative p-6 rounded-xl border-2 transition-all duration-200 text-center
                          ${travelStyle === option.value
                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                            : 'border-border/50 bg-background/50 hover:border-primary/50'
                          }
                        `}
                      >
                        {travelStyle === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </motion.div>
                        )}
                        <div className={`p-3 rounded-full mx-auto w-fit mb-3 ${travelStyle === option.value ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {option.icon}
                        </div>
                        <span className={`font-medium ${travelStyle === option.value ? 'text-primary' : 'text-foreground'}`}>
                          {option.label}
                        </span>
                        {option.description && (
                          <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}

                {step.id === 'dates' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">I'm flexible with dates</p>
                          <p className="text-sm text-muted-foreground">We'll find the best time for you</p>
                        </div>
                      </div>
                      <Switch checked={flexibleDates} onCheckedChange={setFlexibleDates} />
                    </div>

                    {!flexibleDates && (
                      <div className="flex justify-center">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full max-w-xs gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="center">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>
                )}

                {step.id === 'special_requests' && (
                  <div>
                    <Textarea
                      placeholder="Any dietary restrictions, accessibility needs, must-see places, or things you want to avoid? Tell us here..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="min-h-[150px] bg-background/50"
                    />
                    <p className="text-xs text-muted-foreground mt-2">This is optional but helps us personalize your trip</p>
                  </div>
                )}

                {step.id === 'confirmation' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-1">Budget</p>
                        <p className="font-semibold text-foreground">
                          ₹{budgetRange[0].toLocaleString()} - ₹{budgetRange[1].toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-1">Travel Style</p>
                        <p className="font-semibold text-foreground capitalize">{travelStyle || 'Not selected'}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {interests.map(i => (
                          <span key={i} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm capitalize">
                            {i.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">Activities</p>
                      <div className="flex flex-wrap gap-2">
                        {activities.map(a => (
                          <span key={a} className="px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-sm capitalize">
                            {a.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                      <p className="text-sm text-muted-foreground mb-1">Dates</p>
                      <p className="font-semibold text-foreground">
                        {flexibleDates ? 'Flexible' : selectedDate ? format(selectedDate, 'PPP') : 'Not selected'}
                      </p>
                    </div>

                    {specialRequests && (
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-1">Special Requests</p>
                        <p className="text-foreground">{specialRequests}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/30">
              <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0} className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {isLastStep ? (
                <Button onClick={handleSubmit} disabled={submitting} className="gap-2 bg-primary hover:bg-primary/90">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Request
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={!canContinue()} className="gap-2">
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurpriseTrip;
