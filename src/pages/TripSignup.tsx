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
      const { error: signUpError } = await signUp(profileData.email, profileData.password, fullName);

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Store additional profile data for post-login save
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

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-navy-medium to-navy-deep py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {getTripIcon()}
            <span className="ml-2">{getTripTypeLabel(validTripType)}</span>
          </Badge>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-6 bg-destructive/10 border-destructive/30">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between mt-8"
        >
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-border"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="bg-primary text-primary-foreground"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : currentStep === totalSteps - 1 ? (
              'Create Account'
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </motion.div>

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-muted-foreground mt-8 text-sm"
        >
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </motion.p>
      </div>
    </div>
  );
};

export default TripSignup;
