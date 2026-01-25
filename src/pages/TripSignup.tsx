import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  ArrowRight, 
  Plane,
  Sparkles,
  Users,
  Compass,
  Map,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { QuestionnaireStep } from '@/components/signup/QuestionnaireStep';
import { BudgetSliderStep } from '@/components/signup/BudgetSliderStep';
import { DatePreferenceStep } from '@/components/signup/DatePreferenceStep';
import { TextAreaStep } from '@/components/signup/TextAreaStep';
import { TravelerCountStep } from '@/components/signup/TravelerCountStep';
import { ProfileCreationStep } from '@/components/signup/ProfileCreationStep';
import {
  getSignupSession,
  createSignupSession,
  updateQuestionnaireAnswers,
  updateCurrentStep,
  getTripTypeLabel,
  TripTypeSelection,
  QuestionnaireAnswers,
} from '@/lib/signupSession';

// Question configurations for each trip type
const INTERESTS_OPTIONS = [
  { value: 'beaches', label: 'Beaches & Islands' },
  { value: 'mountains', label: 'Mountains & Hiking' },
  { value: 'culture', label: 'Culture & Heritage' },
  { value: 'adventure', label: 'Adventure Sports' },
  { value: 'food', label: 'Food & Culinary' },
  { value: 'wildlife', label: 'Wildlife & Nature' },
  { value: 'nightlife', label: 'Nightlife & Parties' },
  { value: 'wellness', label: 'Wellness & Spa' },
];

const ACTIVITIES_OPTIONS = [
  { value: 'trekking', label: 'Trekking & Hiking' },
  { value: 'water_sports', label: 'Water Sports' },
  { value: 'camping', label: 'Camping' },
  { value: 'photography', label: 'Photography' },
  { value: 'local_food', label: 'Local Food Tours' },
  { value: 'temples', label: 'Temple Visits' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'meditation', label: 'Meditation & Yoga' },
];

const TRAVEL_STYLE_OPTIONS = [
  { value: 'solo', label: 'Solo Explorer', description: 'Adventure on your own terms' },
  { value: 'couple', label: 'Romantic Getaway', description: 'Perfect for couples' },
  { value: 'friends', label: 'Friends Trip', description: 'Fun with your squad' },
  { value: 'family', label: 'Family Vacation', description: 'For all ages' },
];

const ACCOMMODATION_OPTIONS = [
  { value: 'hostels', label: 'Hostels', description: 'Budget-friendly, social vibes' },
  { value: 'budget_hotels', label: 'Budget Hotels', description: 'Comfortable basics' },
  { value: 'mid_range', label: 'Mid-Range Hotels', description: 'Best value comfort' },
  { value: 'luxury', label: 'Luxury Resorts', description: 'Premium experience' },
  { value: 'unique_stays', label: 'Unique Stays', description: 'Treehouses, houseboats, etc.' },
];

const ACTIVITY_LEVEL_OPTIONS = [
  { value: 'chill', label: 'Relaxed', description: 'Take it easy, enjoy the moment' },
  { value: 'moderate', label: 'Balanced', description: 'Mix of active and relaxing' },
  { value: 'active', label: 'Adventure Mode', description: 'Pack in the activities!' },
];

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const TripSignup = () => {
  const { tripType } = useParams<{ tripType: string }>();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Questionnaire state
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    interests: [],
    activities: [],
    budget_min: 15000,
    budget_max: 50000,
    travel_style: '',
    accommodation_pref: '',
    activity_level: '',
    flexible_dates: true,
    special_requests: '',
    destination_ideas: [],
    num_travelers: 2,
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Profile state
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [profileErrors, setProfileErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});

  // Validate trip type
  const validTripType = tripType as TripTypeSelection;
  const isValidType = ['surprise', 'group', 'custom', 'standard'].includes(validTripType);

  useEffect(() => {
    if (!isValidType) {
      navigate('/get-started');
      return;
    }

    // Check for existing session or create new one
    let session = getSignupSession();
    if (!session || session.tripType !== validTripType) {
      session = createSignupSession(validTripType, '/');
    }

    // Restore answers from session
    if (session.questionnaireAnswers) {
      setAnswers(prev => ({ ...prev, ...session!.questionnaireAnswers }));
    }
    setCurrentStep(session.currentStep);
  }, [validTripType, isValidType, navigate]);

  // Get steps based on trip type
  const getSteps = () => {
    const baseSteps = ['interests', 'budget', 'travel_style', 'dates', 'profile'];
    
    switch (validTripType) {
      case 'surprise':
        return ['interests', 'activities', 'budget', 'travel_style', 'dates', 'special_requests', 'profile'];
      case 'custom':
        return ['interests', 'activities', 'travelers', 'budget', 'accommodation', 'dates', 'special_requests', 'profile'];
      case 'group':
        return ['interests', 'activity_level', 'budget', 'travel_style', 'profile'];
      case 'standard':
      default:
        return baseSteps;
    }
  };

  const steps = getSteps();
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleAnswerChange = (key: keyof QuestionnaireAnswers, value: any) => {
    setAnswers(prev => {
      const updated = { ...prev, [key]: value };
      updateQuestionnaireAnswers(updated);
      return updated;
    });
  };

  const handleMultiSelect = (key: keyof QuestionnaireAnswers, value: string) => {
    setAnswers(prev => {
      const current = (prev[key] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      const newAnswers = { ...prev, [key]: updated };
      updateQuestionnaireAnswers(newAnswers);
      return newAnswers;
    });
  };

  const handleSingleSelect = (key: keyof QuestionnaireAnswers, value: string) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [key]: value };
      updateQuestionnaireAnswers(newAnswers);
      return newAnswers;
    });
  };

  const handleProfileChange = (data: Partial<ProfileFormData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
    // Clear related errors
    Object.keys(data).forEach(key => {
      if (profileErrors[key as keyof ProfileFormData]) {
        setProfileErrors(prev => ({ ...prev, [key]: undefined }));
      }
    });
  };

  const validateProfile = (): boolean => {
    const errors: Partial<Record<keyof ProfileFormData, string>> = {};

    if (!profileData.firstName.trim()) errors.firstName = 'First name is required';
    if (!profileData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!profileData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) errors.email = 'Invalid email format';
    if (!profileData.phone.trim()) errors.phone = 'Phone number is required';
    if (profileData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (profileData.password !== profileData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateProfile()) return;

    setLoading(true);
    setError('');

    const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();

    try {
      // Store additional profile data for post-login save BEFORE signup
      const session = getSignupSession();
      if (session) {
        session.profileData = {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          email: profileData.email,
        };
        session.questionnaireAnswers = {
          ...answers,
          preferred_dates: selectedDate?.toISOString(),
        };
        sessionStorage.setItem('travelamigo_signup_session', JSON.stringify(session));
      }

      const result = await signUp(profileData.email, profileData.password, fullName);

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      // Check if email confirmation is required
      if ((result as any).needsEmailConfirmation) {
        // Show success state with email confirmation message
        setSuccess(true);
        setLoading(false);
        return;
      }

      // User is logged in, redirect to dashboard
      // The dashboard or login page will process the signup session
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      updateCurrentStep(nextStep);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/get-started');
    }
  };

  const canProceed = () => {
    const step = steps[currentStep];
    switch (step) {
      case 'interests':
        return (answers.interests?.length || 0) > 0;
      case 'activities':
        return (answers.activities?.length || 0) > 0;
      case 'travel_style':
        return !!answers.travel_style;
      case 'accommodation':
        return !!answers.accommodation_pref;
      case 'activity_level':
        return !!answers.activity_level;
      case 'budget':
        return answers.budget_min! > 0 && answers.budget_max! > answers.budget_min!;
      case 'dates':
        return answers.flexible_dates || !!selectedDate;
      case 'travelers':
        return (answers.num_travelers || 0) > 0;
      case 'special_requests':
        return true; // Optional
      case 'profile':
        return (
          profileData.firstName.trim() &&
          profileData.lastName.trim() &&
          profileData.email.trim() &&
          profileData.phone.trim() &&
          profileData.password.length >= 8 &&
          profileData.password === profileData.confirmPassword
        );
      default:
        return true;
    }
  };

  const getTripIcon = () => {
    const icons: Record<TripTypeSelection, React.ReactNode> = {
      surprise: <Sparkles className="h-5 w-5" />,
      group: <Users className="h-5 w-5" />,
      custom: <Compass className="h-5 w-5" />,
      standard: <Map className="h-5 w-5" />,
    };
    return icons[validTripType] || <Plane className="h-5 w-5" />;
  };

  if (!isValidType) return null;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-deep via-navy-medium to-navy-deep p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
            <CardContent className="pt-8 pb-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-display text-foreground">Check your email!</h2>
              <p className="text-muted-foreground">
                We've sent a confirmation link to <strong>{profileData.email}</strong>.
                Please verify your email to complete your {getTripTypeLabel(validTripType)} request.
              </p>
              <div className="pt-4">
                <Button onClick={() => navigate('/login')} variant="outline">
                  Go to Login
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your {getTripTypeLabel(validTripType).toLowerCase()} preferences have been saved and will be submitted after verification.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const renderStep = () => {
    const step = steps[currentStep];

    switch (step) {
      case 'interests':
        return (
          <QuestionnaireStep
            title="What excites you most?"
            description="Select your travel interests"
            options={INTERESTS_OPTIONS}
            selectedValues={answers.interests || []}
            onSelect={(v) => handleMultiSelect('interests', v)}
            multiSelect
            columns={2}
          />
        );

      case 'activities':
        return (
          <QuestionnaireStep
            title="What activities do you love?"
            description="Pick activities for your adventure"
            options={ACTIVITIES_OPTIONS}
            selectedValues={answers.activities || []}
            onSelect={(v) => handleMultiSelect('activities', v)}
            multiSelect
            columns={2}
          />
        );

      case 'budget':
        return (
          <BudgetSliderStep
            title="What's your budget range?"
            description="Per person, for the entire trip"
            minBudget={answers.budget_min || 15000}
            maxBudget={answers.budget_max || 50000}
            onMinChange={(v) => handleAnswerChange('budget_min', v)}
            onMaxChange={(v) => handleAnswerChange('budget_max', v)}
          />
        );

      case 'travel_style':
        return (
          <QuestionnaireStep
            title="How do you like to travel?"
            description="Select your travel style"
            options={TRAVEL_STYLE_OPTIONS}
            selectedValues={answers.travel_style ? [answers.travel_style] : []}
            onSelect={(v) => handleSingleSelect('travel_style', v)}
            columns={2}
          />
        );

      case 'accommodation':
        return (
          <QuestionnaireStep
            title="Where would you like to stay?"
            description="Choose your accommodation preference"
            options={ACCOMMODATION_OPTIONS}
            selectedValues={answers.accommodation_pref ? [answers.accommodation_pref] : []}
            onSelect={(v) => handleSingleSelect('accommodation_pref', v)}
            columns={2}
          />
        );

      case 'activity_level':
        return (
          <QuestionnaireStep
            title="What's your activity level?"
            description="How active do you want your trip to be?"
            options={ACTIVITY_LEVEL_OPTIONS}
            selectedValues={answers.activity_level ? [answers.activity_level] : []}
            onSelect={(v) => handleSingleSelect('activity_level', v)}
            columns={3}
          />
        );

      case 'dates':
        return (
          <DatePreferenceStep
            title="When would you like to travel?"
            description="Select your preferred travel dates"
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            flexibleDates={answers.flexible_dates || false}
            onFlexibleChange={(v) => handleAnswerChange('flexible_dates', v)}
          />
        );

      case 'travelers':
        return (
          <TravelerCountStep
            title="How many travelers?"
            description="Including yourself"
            count={answers.num_travelers || 2}
            onChange={(v) => handleAnswerChange('num_travelers', v)}
          />
        );

      case 'special_requests':
        return (
          <TextAreaStep
            title="Any special requests?"
            description="Tell us about any specific preferences or requirements"
            placeholder="E.g., vegetarian food, accessibility needs, must-visit places, avoid crowded spots..."
            value={answers.special_requests || ''}
            onChange={(v) => handleAnswerChange('special_requests', v)}
          />
        );

      case 'profile':
        return (
          <ProfileCreationStep
            title="Create Your Account"
            description="Almost there! Set up your TravelAmigo profile"
            data={profileData}
            onChange={handleProfileChange}
            errors={profileErrors}
          />
        );

      default:
        return null;
    }
  };

  const getGradientColors = () => {
    const gradients: Record<TripTypeSelection, string> = {
      surprise: 'from-purple-600/20 via-pink-500/10 to-orange-400/20',
      group: 'from-blue-600/20 via-cyan-500/10 to-teal-400/20',
      custom: 'from-orange-600/20 via-amber-500/10 to-yellow-400/20',
      standard: 'from-green-600/20 via-emerald-500/10 to-teal-400/20',
    };
    return gradients[validTripType];
  };

  const getAccentColor = () => {
    const accents: Record<TripTypeSelection, string> = {
      surprise: 'bg-gradient-to-r from-purple-500 to-pink-500',
      group: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      custom: 'bg-gradient-to-r from-orange-500 to-amber-500',
      standard: 'bg-gradient-to-r from-green-500 to-emerald-500',
    };
    return accents[validTripType];
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-navy-deep via-navy-medium to-navy-deep" />
      
      {/* Floating Orbs */}
      <motion.div 
        className={`fixed top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-30 ${getAccentColor()}`}
        animate={{ 
          x: [0, 50, 0], 
          y: [0, 30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className={`fixed bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-20 ${getAccentColor()}`}
        animate={{ 
          x: [0, -30, 0], 
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 bg-primary"
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground backdrop-blur-sm bg-white/5 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <motion.div 
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${getAccentColor()} text-white shadow-lg`}
              whileHover={{ scale: 1.05 }}
            >
              {getTripIcon()}
              <span className="font-medium text-sm">{getTripTypeLabel(validTripType)}</span>
            </motion.div>
          </motion.div>

          {/* Progress Bar - Creative Design */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                    index < currentStep 
                      ? getAccentColor()
                      : index === currentStep 
                        ? 'bg-primary animate-pulse'
                        : 'bg-white/10'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Step {currentStep + 1} of {totalSteps}</span>
              <motion.span 
                className="text-primary font-semibold"
                key={progress}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {Math.round(progress)}% complete
              </motion.span>
            </div>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
              >
                <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/30 backdrop-blur-sm">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Glow Effect */}
            <div className={`absolute -inset-1 ${getAccentColor()} rounded-3xl blur-xl opacity-20`} />
            
            {/* Card */}
            <Card className="relative border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
              {/* Card Header Decoration */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${getAccentColor()}`} />
              
              <CardContent className="p-8 min-h-[450px] flex flex-col">
                {/* Step Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1"
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between mt-8 gap-4"
          >
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 h-14 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-foreground rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className={`w-full h-14 ${getAccentColor()} text-white font-semibold shadow-lg rounded-xl border-0 disabled:opacity-50`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : currentStep === totalSteps - 1 ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Create Account
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>

          {/* Login Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-muted-foreground mt-8 text-sm"
          >
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </motion.p>

          {/* Fun Facts / Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">
                {validTripType === 'surprise' && "10,000+ travelers surprised with unforgettable trips!"}
                {validTripType === 'group' && "Join 500+ group trips happening every month!"}
                {validTripType === 'custom' && "Our experts have planned 2,000+ custom trips!"}
                {validTripType === 'standard' && "50+ curated packages to choose from!"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TripSignup;
