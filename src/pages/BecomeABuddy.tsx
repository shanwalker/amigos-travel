import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateLocalBuddy } from '@/hooks/useLocalBuddies';
import { toast } from 'sonner';
import { 
  ArrowLeft, ArrowRight, MapPin, Globe, Car, Heart,
  Check, Loader2, Users, Star, Shield, Sparkles
} from 'lucide-react';
import logo from '@/assets/logo.png';

const STEPS = [
  { id: 1, title: 'Location', icon: MapPin },
  { id: 2, title: 'About You', icon: Heart },
  { id: 3, title: 'Languages', icon: Globe },
  { id: 4, title: 'Transport', icon: Car },
  { id: 5, title: 'Interests', icon: Sparkles },
];

const COUNTRIES = [
  'India', 'Thailand', 'Vietnam', 'Indonesia', 'Nepal', 
  'Sri Lanka', 'Philippines', 'Japan', 'Malaysia', 'Cambodia'
];

const LANGUAGES = [
  'English', 'Hindi', 'Thai', 'Vietnamese', 'Indonesian',
  'Japanese', 'Mandarin', 'Tamil', 'Bengali', 'Nepali',
  'Spanish', 'French', 'German', 'Korean', 'Arabic'
];

const INTERESTS = [
  { id: 'food', name: 'Food & Cuisine', emoji: '🍜' },
  { id: 'nightlife', name: 'Nightlife', emoji: '🎉' },
  { id: 'culture', name: 'Culture & History', emoji: '🏛️' },
  { id: 'adventure', name: 'Adventure Sports', emoji: '🏄' },
  { id: 'nature', name: 'Nature & Wildlife', emoji: '🌿' },
  { id: 'photography', name: 'Photography', emoji: '📸' },
  { id: 'shopping', name: 'Shopping', emoji: '🛍️' },
  { id: 'wellness', name: 'Wellness & Spa', emoji: '💆' },
  { id: 'trekking', name: 'Trekking', emoji: '🥾' },
  { id: 'beaches', name: 'Beaches', emoji: '🏖️' },
];

const VEHICLE_TYPES = [
  'Car', 'Motorcycle', 'Scooter', 'Bicycle', 'Tuk-Tuk', 'Van'
];

// Validation schema
const buddySchema = z.object({
  city: z.string().min(2, 'City is required').max(100),
  country: z.string().min(2, 'Country is required'),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(500, 'Bio must be less than 500 characters'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  interests: z.array(z.string()).min(2, 'Select at least 2 interests'),
});

const BecomeABuddy = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createBuddy = useCreateLocalBuddy();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    city: '',
    country: '',
    bio: '',
    languages: ['English'] as string[],
    hasVehicle: false,
    vehicleType: '',
    interests: [] as string[],
  });

  const updateField = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleArrayItem = (field: 'languages' | 'interests', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.country) newErrors.country = 'Country is required';
        break;
      case 2:
        if (formData.bio.length < 50) newErrors.bio = 'Bio must be at least 50 characters';
        if (formData.bio.length > 500) newErrors.bio = 'Bio must be less than 500 characters';
        break;
      case 3:
        if (formData.languages.length === 0) newErrors.languages = 'Select at least one language';
        break;
      case 5:
        if (formData.interests.length < 2) newErrors.interests = 'Select at least 2 interests';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.city.trim() && formData.country;
      case 2: return formData.bio.length >= 50;
      case 3: return formData.languages.length > 0;
      case 4: return true; // Vehicle is optional
      case 5: return formData.interests.length >= 2;
      default: return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please login to become a Local Buddy');
      navigate('/login');
      return;
    }

    // Final validation
    const validation = buddySchema.safeParse(formData);
    if (!validation.success) {
      toast.error('Please check all required fields');
      return;
    }

    try {
      await createBuddy.mutateAsync({
        user_id: user.id,
        location: `${formData.city}, ${formData.country}`,
        city: formData.city.trim(),
        country: formData.country,
        bio: formData.bio.trim(),
        languages: formData.languages,
        interests: formData.interests,
        has_vehicle: formData.hasVehicle,
        vehicle_type: formData.hasVehicle ? formData.vehicleType : null,
        is_active: true,
        is_verified: false,
        rating: null,
      });

      toast.success(
        <div className="flex flex-col">
          <span className="font-semibold">Application Submitted! 🎉</span>
          <span className="text-sm">We'll review and verify your profile within 48 hours.</span>
        </div>
      );
      navigate('/dashboard');
    } catch (error: any) {
      if (error?.message?.includes('duplicate')) {
        toast.error('You already have a Local Buddy profile!');
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display text-foreground mb-2">
                Where are you based?
              </h2>
              <p className="text-muted-foreground">Tell us your home city</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select value={formData.country} onValueChange={(v) => updateField('country', v)}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {COUNTRIES.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="e.g., Bangkok, Mumbai, Bali"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="bg-background/50"
                  maxLength={100}
                />
                {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display text-foreground mb-2">
                Tell travelers about yourself
              </h2>
              <p className="text-muted-foreground">What makes you a great local guide?</p>
            </div>
            
            <div className="max-w-lg mx-auto space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Your Bio *</Label>
                <Textarea
                  id="bio"
                  placeholder="Share what you love about your city, your favorite hidden spots, and what kind of experiences you can offer travelers..."
                  value={formData.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  className="bg-background/50 min-h-[150px]"
                  maxLength={500}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{errors.bio && <span className="text-destructive">{errors.bio}</span>}</span>
                  <span className={formData.bio.length < 50 ? 'text-destructive' : ''}>
                    {formData.bio.length}/500 (min 50)
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display text-foreground mb-2">
                What languages do you speak?
              </h2>
              <p className="text-muted-foreground">Select all that apply</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center">
                {LANGUAGES.map(lang => (
                  <motion.button
                    key={lang}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleArrayItem('languages', lang)}
                    className={`px-4 py-2 rounded-full border-2 transition-all ${
                      formData.languages.includes(lang)
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-border hover:border-primary/50 text-muted-foreground'
                    }`}
                  >
                    {lang}
                    {formData.languages.includes(lang) && (
                      <Check className="w-4 h-4 ml-2 inline" />
                    )}
                  </motion.button>
                ))}
              </div>
              {errors.languages && (
                <p className="text-sm text-destructive text-center mt-4">{errors.languages}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display text-foreground mb-2">
                Do you have transport?
              </h2>
              <p className="text-muted-foreground">Optional - helps travelers plan better</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <Car className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">I have my own vehicle</p>
                    <p className="text-sm text-muted-foreground">Can pick up travelers</p>
                  </div>
                </div>
                <Switch
                  checked={formData.hasVehicle}
                  onCheckedChange={(checked) => updateField('hasVehicle', checked)}
                />
              </div>

              {formData.hasVehicle && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label>Vehicle Type</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {VEHICLE_TYPES.map(type => (
                      <Button
                        key={type}
                        variant={formData.vehicleType === type ? 'default' : 'outline'}
                        onClick={() => updateField('vehicleType', type)}
                        className="w-full"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display text-foreground mb-2">
                What are you passionate about?
              </h2>
              <p className="text-muted-foreground">Select at least 2 interests to match with travelers</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {INTERESTS.map(interest => (
                  <motion.button
                    key={interest.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleArrayItem('interests', interest.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      formData.interests.includes(interest.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl block mb-2">{interest.emoji}</span>
                    <span className="text-xs font-medium text-foreground">{interest.name}</span>
                    {formData.interests.includes(interest.id) && (
                      <Check className="w-4 h-4 text-primary mx-auto mt-2" />
                    )}
                  </motion.button>
                ))}
              </div>
              {errors.interests && (
                <p className="text-sm text-destructive text-center mt-4">{errors.interests}</p>
              )}
              <p className="text-center text-sm text-muted-foreground mt-4">
                Selected: {formData.interests.length}/10 (min 2)
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Travel Amigo" className="h-8 w-auto" />
          </Link>
          <Badge variant="outline" className="border-primary/50 text-primary">
            <Users className="w-3 h-3 mr-1" />
            Become a Local Buddy
          </Badge>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Benefits Banner */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Why become a Local Buddy?
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { icon: '💰', title: 'Earn Extra Income', desc: 'Get paid for showing your city' },
                    { icon: '🌍', title: 'Meet Travelers', desc: 'Make friends worldwide' },
                    { icon: '⭐', title: 'Build Your Profile', desc: 'Earn ratings and reviews' },
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-2xl">{benefit.icon}</span>
                      <div>
                        <p className="font-medium text-foreground text-sm">{benefit.title}</p>
                        <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <motion.div
                      className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : isCompleted 
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </motion.div>
                    {index < STEPS.length - 1 && (
                      <div className={`w-8 h-0.5 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-12 max-w-md mx-auto">
            <Button
              variant="outline"
              onClick={() => currentStep === 1 ? navigate('/') : setCurrentStep(prev => prev - 1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {currentStep === 1 ? 'Home' : 'Back'}
            </Button>
            
            {currentStep < STEPS.length ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || createBuddy.isPending}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                {createBuddy.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-muted-foreground mt-8 max-w-md mx-auto">
            By submitting, you agree to our verification process. 
            Your profile will be reviewed within 48 hours.
          </p>
        </div>
      </main>
    </div>
  );
};

export default BecomeABuddy;
