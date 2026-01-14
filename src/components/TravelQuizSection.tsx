import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Palmtree, Mountain, Building, PartyPopper, Leaf, Zap, Wallet, Crown, User, Users, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import tripBali from '@/assets/trip-bali.jpg';
import tripJapan from '@/assets/trip-japan.jpg';
import tripThailand from '@/assets/trip-thailand.jpg';

interface QuizOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface QuizStep {
  question: string;
  options: QuizOption[];
}

const quizSteps: QuizStep[] = [
  {
    question: 'What\'s your dream escape?',
    options: [
      { id: 'beach', label: 'Beach Paradise', icon: <Palmtree className="w-6 h-6" />, description: 'Crystal waters & sandy shores' },
      { id: 'mountain', label: 'Mountain Escape', icon: <Mountain className="w-6 h-6" />, description: 'Peaks, trails & fresh air' },
      { id: 'city', label: 'City Explorer', icon: <Building className="w-6 h-6" />, description: 'Culture, food & nightlife' },
    ],
  },
  {
    question: 'What\'s your travel vibe?',
    options: [
      { id: 'party', label: 'Party Mode', icon: <PartyPopper className="w-6 h-6" />, description: 'Dance till sunrise' },
      { id: 'peaceful', label: 'Peaceful Retreat', icon: <Leaf className="w-6 h-6" />, description: 'Yoga, spa & meditation' },
      { id: 'adventure', label: 'Adventure Rush', icon: <Zap className="w-6 h-6" />, description: 'Skydiving & bungee jumping' },
    ],
  },
  {
    question: 'Your budget style?',
    options: [
      { id: 'budget', label: 'Smart Saver', icon: <Wallet className="w-6 h-6" />, description: 'Best value experiences' },
      { id: 'premium', label: 'Premium Experience', icon: <Crown className="w-6 h-6" />, description: 'Luxury all the way' },
    ],
  },
  {
    question: 'How do you travel?',
    options: [
      { id: 'solo', label: 'Solo Explorer', icon: <User className="w-6 h-6" />, description: 'Finding my tribe' },
      { id: 'friends', label: 'With My Crew', icon: <Users className="w-6 h-6" />, description: 'Squad goals' },
    ],
  },
];

const tripRecommendations = [
  { 
    name: 'Bali Bliss Retreat', 
    image: tripBali, 
    match: 95, 
    price: '₹52,999',
    tags: ['Beach', 'Wellness', 'Premium'],
  },
  { 
    name: 'Japan Cultural Journey', 
    image: tripJapan, 
    match: 88, 
    price: '₹89,999',
    tags: ['City', 'Culture', 'Premium'],
  },
  { 
    name: 'Thailand Adventure', 
    image: tripThailand, 
    match: 82, 
    price: '₹45,999',
    tags: ['Party', 'Adventure', 'Budget'],
  },
];

const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none z-50">
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-3 h-3 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: i % 2 === 0 ? '#FFB400' : '#fff',
        }}
        initial={{ top: '-10%', opacity: 1, rotate: 0 }}
        animate={{
          top: '110%',
          opacity: 0,
          rotate: Math.random() * 360,
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          delay: Math.random() * 0.5,
          ease: 'easeOut',
        }}
      />
    ))}
  </div>
);

export const TravelQuizSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSelect = (optionId: string) => {
    const newAnswers = [...answers, optionId];
    setAnswers(newAnswers);

    if (currentStep < quizSteps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setShowConfetti(true);
      setTimeout(() => {
        setShowResults(true);
        setShowConfetti(false);
      }, 1500);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
    setShowResults(false);
  };

  const progress = ((currentStep + 1) / quizSteps.length) * 100;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-navy to-background relative overflow-hidden">
      {showConfetti && <Confetti />}
      
      {/* Background Decoration */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-amigo-orange/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-48 h-48 bg-amigo-orange/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-amigo-orange font-medium text-sm tracking-wider uppercase mb-4 block">
            Find Your Perfect Trip
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Travel <span className="text-amigo-orange">Quiz</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Answer 4 quick questions and we'll match you with your dream adventure.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Question {currentStep + 1} of {quizSteps.length}</span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <div className="h-2 bg-navy/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amigo-orange to-amber-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Question */}
                <h3 className="font-serif text-2xl md:text-3xl text-foreground text-center mb-8">
                  {quizSteps[currentStep].question}
                </h3>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quizSteps[currentStep].options.map((option, index) => (
                    <motion.button
                      key={option.id}
                      className="glass-card p-6 rounded-2xl text-left group hover:border-amigo-orange/50 transition-all"
                      onClick={() => handleSelect(option.id)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className="w-14 h-14 rounded-xl bg-amigo-orange/10 flex items-center justify-center text-amigo-orange mb-4 group-hover:bg-amigo-orange group-hover:text-navy transition-colors"
                        whileHover={{ rotate: 10 }}
                      >
                        {option.icon}
                      </motion.div>
                      <h4 className="font-semibold text-foreground text-lg mb-1">{option.label}</h4>
                      <p className="text-muted-foreground text-sm">{option.description}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Results Header */}
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <Sparkles className="w-12 h-12 text-amigo-orange mx-auto mb-4" />
                  </motion.div>
                  <h3 className="font-serif text-3xl text-foreground mb-2">
                    Your Perfect Adventures Await!
                  </h3>
                  <p className="text-muted-foreground">Based on your preferences, here are our top picks:</p>
                </div>

                {/* Recommended Trips */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {tripRecommendations.map((trip, index) => (
                    <motion.div
                      key={trip.name}
                      className="glass-card rounded-2xl overflow-hidden group"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.15 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img 
                          src={trip.image} 
                          alt={trip.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-amigo-orange text-navy text-sm font-bold px-3 py-1 rounded-full">
                          {trip.match}% match
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="font-semibold text-foreground text-lg">{trip.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {trip.tags.map(tag => (
                            <span key={tag} className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-amigo-orange font-bold">{trip.price}</span>
                          <motion.button
                            className="flex items-center gap-1 text-sm text-foreground hover:text-amigo-orange transition-colors"
                            whileHover={{ x: 3 }}
                          >
                            View <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Reset Button */}
                <div className="text-center">
                  <motion.button
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-amigo-orange transition-colors"
                    onClick={resetQuiz}
                    whileHover={{ scale: 1.05 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retake Quiz
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
