import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Users, 
  Compass, 
  Map,
  ArrowRight,
  Plane
} from 'lucide-react';
import { 
  createSignupSession, 
  TripTypeSelection,
  getTripTypeLabel,
  getTripTypeDescription 
} from '@/lib/signupSession';

interface TripOption {
  type: TripTypeSelection;
  icon: React.ReactNode;
  color: string;
  features: string[];
}

const tripOptions: TripOption[] = [
  {
    type: 'surprise',
    icon: <Sparkles className="h-8 w-8" />,
    color: 'from-purple-500 to-pink-500',
    features: ['Mystery destination', 'Personalized to you', 'Local buddy guide'],
  },
  {
    type: 'group',
    icon: <Users className="h-8 w-8" />,
    color: 'from-blue-500 to-cyan-500',
    features: ['Meet travelers', 'Fixed dates', 'All-inclusive'],
  },
  {
    type: 'custom',
    icon: <Compass className="h-8 w-8" />,
    color: 'from-orange-500 to-amber-500',
    features: ['Full flexibility', 'Your itinerary', 'Expert planning'],
  },
  {
    type: 'standard',
    icon: <Map className="h-8 w-8" />,
    color: 'from-green-500 to-emerald-500',
    features: ['Ready packages', 'Instant booking', 'Curated experiences'],
  },
];

export const TripTypeSelector = () => {
  const navigate = useNavigate();

  const handleSelectTripType = (type: TripTypeSelection) => {
    createSignupSession(type, window.location.pathname);
    navigate(`/signup/${type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-navy-medium to-navy-deep py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Plane className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">
            How Would You Like to Travel?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your adventure style and we'll customize everything for you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tripOptions.map((option, index) => (
            <motion.div
              key={option.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="h-full bg-card/50 border-border/50 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 cursor-pointer group overflow-hidden"
                onClick={() => handleSelectTripType(option.type)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {option.icon}
                  </div>
                  <CardTitle className="text-xl font-display text-foreground">
                    {getTripTypeLabel(option.type)}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {getTripTypeDescription(option.type)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {option.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-muted-foreground mt-12"
        >
          Already have an account?{' '}
          <Button 
            variant="link" 
            className="text-primary p-0"
            onClick={() => navigate('/login')}
          >
            Sign in here
          </Button>
        </motion.p>
      </div>
    </div>
  );
};

export default TripTypeSelector;
