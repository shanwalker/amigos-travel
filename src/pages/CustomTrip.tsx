import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateCustomRequest } from '@/hooks/useCustomRequests';
import { toast } from 'sonner';
import { 
  ArrowLeft, ArrowRight, MapPin, Sparkles, Users, 
  Calendar as CalendarIcon, Home, Utensils, Camera,
  Tent, Ship, Mountain, Waves, Check, Loader2, Wand2
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

const STEPS = [
  { id: 1, title: 'Destinations', icon: MapPin },
  { id: 2, title: 'Activities', icon: Camera },
  { id: 3, title: 'Stay Type', icon: Home },
  { id: 4, title: 'Travelers', icon: Users },
  { id: 5, title: 'Budget', icon: Sparkles },
  { id: 6, title: 'Dates', icon: CalendarIcon },
  { id: 7, title: 'Details', icon: Wand2 },
];

const DESTINATIONS = [
  { id: 'thailand', name: 'Thailand', emoji: '🇹🇭' },
  { id: 'bali', name: 'Bali', emoji: '🇮🇩' },
  { id: 'vietnam', name: 'Vietnam', emoji: '🇻🇳' },
  { id: 'japan', name: 'Japan', emoji: '🇯🇵' },
  { id: 'nepal', name: 'Nepal', emoji: '🇳🇵' },
  { id: 'sri-lanka', name: 'Sri Lanka', emoji: '🇱🇰' },
  { id: 'maldives', name: 'Maldives', emoji: '🇲🇻' },
  { id: 'philippines', name: 'Philippines', emoji: '🇵🇭' },
  { id: 'other', name: 'Other', emoji: '🌍' },
];

const ACTIVITIES = [
  { id: 'beach', name: 'Beach & Islands', icon: Waves },
  { id: 'adventure', name: 'Adventure Sports', icon: Mountain },
  { id: 'cultural', name: 'Cultural Tours', icon: Camera },
  { id: 'food', name: 'Food & Culinary', icon: Utensils },
  { id: 'camping', name: 'Camping', icon: Tent },
  { id: 'cruise', name: 'Cruise', icon: Ship },
  { id: 'trekking', name: 'Trekking', icon: Mountain },
  { id: 'nightlife', name: 'Nightlife', icon: Sparkles },
];

const STAY_TYPES = [
  { id: 'budget', name: 'Budget Hostels', desc: 'Social & affordable', price: '₹' },
  { id: 'mid-range', name: 'Mid-Range Hotels', desc: 'Comfort & value', price: '₹₹' },
  { id: 'luxury', name: 'Luxury Resorts', desc: 'Premium experience', price: '₹₹₹' },
  { id: 'boutique', name: 'Boutique Stays', desc: 'Unique & curated', price: '₹₹' },
  { id: 'homestay', name: 'Homestays', desc: 'Local experience', price: '₹' },
];

const CustomTrip = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createRequest = useCreateCustomRequest();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    destinations: [] as string[],
    otherDestination: '',
    activities: [] as string[],
    stayType: '',
    travelers: 2,
    budgetRange: [30000, 80000],
    dateRange: undefined as { from: Date; to: Date } | undefined,
    flexibleDates: false,
    specialRequests: '',
    name: '',
    email: '',
    phone: '',
  });

  const updateField = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'destinations' | 'activities', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.destinations.length > 0;
      case 2: return formData.activities.length > 0;
      case 3: return formData.stayType !== '';
      case 4: return formData.travelers >= 1;
      case 5: return formData.budgetRange[0] > 0;
      case 6: return formData.flexibleDates || formData.dateRange?.from;
      case 7: return formData.name && (formData.email || formData.phone);
      default: return true;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please login to submit your request');
      navigate('/login');
      return;
    }

    try {
      const destinations = formData.destinations.includes('other') && formData.otherDestination
        ? [...formData.destinations.filter(d => d !== 'other'), formData.otherDestination]
        : formData.destinations;

      await createRequest.mutateAsync({
        destination: destinations.join(', '),
        interests: formData.activities,
        accommodation_preference: formData.stayType,
        special_requirements: formData.specialRequests || undefined,
        budget_min: formData.budgetRange[0],
        budget_max: formData.budgetRange[1],
        number_of_travelers: formData.travelers,
        travel_dates: formData.dateRange 
          ? { start: format(formData.dateRange.from, 'yyyy-MM-dd'), end: format(formData.dateRange.to || formData.dateRange.from, 'yyyy-MM-dd') }
          : undefined,
        additional_notes: `Contact: ${formData.name}, ${formData.email || ''}, ${formData.phone || ''}`,
      });

      toast.success('Request submitted! We\'ll get back to you within 24 hours.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display text-foreground mb-2">
                Where do you want to go?
              </h2>
              <p className="text-muted-foreground">Select one or more destinations</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {DESTINATIONS.map(dest => (
                <motion.button
                  key={dest.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleArrayItem('destinations', dest.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.destinations.includes(dest.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-3xl mb-2 block">{dest.emoji}</span>
                  <span className="font-medium text-foreground">{dest.name}</span>
                  {formData.destinations.includes(dest.id) && (
                    <Check className="w-4 h-4 text-primary float-right mt-1" />
                  )}
                </motion.button>
              ))}
            </div>
            {formData.destinations.includes('other') && (
              <Input
                placeholder="Enter your dream destination..."
                value={formData.otherDestination}
                onChange={(e) => updateField('otherDestination', e.target.value)}
                className="mt-4 bg-background/50"
              />
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display text-foreground mb-2">
                What experiences interest you?
              </h2>
              <p className="text-muted-foreground">Pick all that excite you</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ACTIVITIES.map(activity => {
                const Icon = activity.icon;
                return (
                  <motion.button
                    key={activity.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleArrayItem('activities', activity.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      formData.activities.includes(activity.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${
                      formData.activities.includes(activity.id) ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <span className="font-medium text-foreground text-sm">{activity.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display text-foreground mb-2">
                Where would you like to stay?
              </h2>
              <p className="text-muted-foreground">Choose your accommodation style</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {STAY_TYPES.map(stay => (
                <motion.button
                  key={stay.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateField('stayType', stay.id)}
                  className={`p-5 rounded-xl border-2 transition-all text-left ${
                    formData.stayType === stay.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-foreground">{stay.name}</span>
                    <Badge variant="outline" className="text-primary">
                      {stay.price}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{stay.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display text-foreground mb-2">
                How many travelers?
              </h2>
              <p className="text-muted-foreground">Including yourself</p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-center gap-6">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full"
                  onClick={() => updateField('travelers', Math.max(1, formData.travelers - 1))}
                >
                  <span className="text-2xl">-</span>
                </Button>
                <div className="text-center">
                  <span className="text-6xl font-display text-primary">{formData.travelers}</span>
                  <p className="text-muted-foreground mt-2">
                    {formData.travelers === 1 ? 'Solo Traveler' : 'Travelers'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full"
                  onClick={() => updateField('travelers', Math.min(20, formData.travelers + 1))}
                >
                  <span className="text-2xl">+</span>
                </Button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display text-foreground mb-2">
                What's your budget per person?
              </h2>
              <p className="text-muted-foreground">Approximate range helps us curate better</p>
            </div>
            <div className="max-w-lg mx-auto space-y-8">
              <div className="text-center">
                <span className="text-4xl font-display text-primary">
                  ₹{formData.budgetRange[0].toLocaleString()} - ₹{formData.budgetRange[1].toLocaleString()}
                </span>
              </div>
              <Slider
                value={formData.budgetRange}
                onValueChange={(value) => updateField('budgetRange', value as [number, number])}
                min={10000}
                max={300000}
                step={5000}
                className="mt-6"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹10,000</span>
                <span>₹3,00,000+</span>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display text-foreground mb-2">
                When do you want to travel?
              </h2>
              <p className="text-muted-foreground">Select dates or keep it flexible</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <Button
                variant={formData.flexibleDates ? 'default' : 'outline'}
                className="w-full py-6"
                onClick={() => {
                  updateField('flexibleDates', !formData.flexibleDates);
                  if (!formData.flexibleDates) updateField('dateRange', undefined);
                }}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                I'm flexible with dates
              </Button>

              {!formData.flexibleDates && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full py-6 justify-start">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      {formData.dateRange?.from ? (
                        formData.dateRange.to ? (
                          `${format(formData.dateRange.from, 'MMM d')} - ${format(formData.dateRange.to, 'MMM d, yyyy')}`
                        ) : (
                          format(formData.dateRange.from, 'MMM d, yyyy')
                        )
                      ) : (
                        'Select travel dates'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card" align="center">
                    <Calendar
                      mode="range"
                      selected={formData.dateRange}
                      onSelect={(range) => updateField('dateRange', range as { from: Date; to: Date })}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display text-foreground mb-2">
                Final Details
              </h2>
              <p className="text-muted-foreground">How can we reach you?</p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <Input
                placeholder="Your name *"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="bg-background/50"
              />
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="bg-background/50"
              />
              <Input
                type="tel"
                placeholder="Phone number (WhatsApp preferred)"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="bg-background/50"
              />
              <Textarea
                placeholder="Any special requests or preferences? (optional)"
                value={formData.specialRequests}
                onChange={(e) => updateField('specialRequests', e.target.value)}
                className="bg-background/50 min-h-[100px]"
              />
            </div>

            {/* Summary */}
            <Card className="max-w-md mx-auto mt-8 p-4 bg-card/50 border-border/50">
              <h3 className="font-semibold text-foreground mb-3">Your Trip Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destinations:</span>
                  <span className="text-foreground">{formData.destinations.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Travelers:</span>
                  <span className="text-foreground">{formData.travelers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="text-foreground">₹{formData.budgetRange[0].toLocaleString()} - ₹{formData.budgetRange[1].toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stay:</span>
                  <span className="text-foreground capitalize">{formData.stayType.replace('-', ' ')}</span>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Travel Amigo" className="h-8 w-auto" />
          </Link>
          <span className="text-sm text-muted-foreground">Custom Trip Planner</span>
        </div>
      </header>
      
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
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
                      <div className={`w-8 h-0.5 ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`} />
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
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || createRequest.isPending}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                {createRequest.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Submit Request
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <p>© 2024 Travel Amigo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CustomTrip;
