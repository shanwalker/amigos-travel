import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, ArrowLeft, ArrowRight, Mail, Lock, User } from 'lucide-react';
import { saveSignupSession, type TripType } from '@/lib/signupSession';

interface QuestionConfig {
    id: string;
    question: string;
    type: 'text' | 'number' | 'select' | 'textarea';
    options?: string[];
    placeholder?: string;
    required?: boolean;
}

const TRIP_QUESTIONS: Record<TripType, QuestionConfig[]> = {
    surprise: [
        { id: 'budget', question: 'What is your budget for this trip?', type: 'number', placeholder: '5000', required: true },
        { id: 'duration', question: 'How many days would you like to travel?', type: 'number', placeholder: '7', required: true },
        { id: 'interests', question: 'What are your main interests?', type: 'textarea', placeholder: 'Adventure, culture, food...', required: true },
        { id: 'climate', question: 'Preferred climate?', type: 'select', options: ['Tropical', 'Temperate', 'Cold', 'Any'], required: true },
    ],
    group: [
        { id: 'groupSize', question: 'How many people in your group?', type: 'number', placeholder: '4', required: true },
        { id: 'preferredDate', question: 'Preferred travel date', type: 'text', placeholder: 'MM/YYYY', required: true },
        { id: 'destination', question: 'Preferred destination (if any)', type: 'text', placeholder: 'Thailand, Bali, etc.', required: false },
        { id: 'specialRequests', question: 'Any special requests?', type: 'textarea', placeholder: 'Dietary restrictions, accessibility needs...', required: false },
    ],
    standard: [
        { id: 'destination', question: 'Which destination interests you?', type: 'select', options: ['Thailand', 'Bali', 'Vietnam', 'Japan', 'Other'], required: true },
        { id: 'travelStyle', question: 'Your travel style?', type: 'select', options: ['Luxury', 'Comfort', 'Budget', 'Backpacker'], required: true },
        { id: 'duration', question: 'Trip duration (days)', type: 'number', placeholder: '7', required: true },
        { id: 'activities', question: 'Preferred activities', type: 'textarea', placeholder: 'Sightseeing, adventure sports, relaxation...', required: true },
    ],
    custom: [
        { id: 'destination', question: 'Where do you want to go?', type: 'text', placeholder: 'Multiple destinations welcome', required: true },
        { id: 'budget', question: 'Your budget', type: 'number', placeholder: '10000', required: true },
        { id: 'duration', question: 'Trip duration (days)', type: 'number', placeholder: '14', required: true },
        { id: 'travelStyle', question: 'Travel style preference', type: 'select', options: ['Luxury', 'Comfort', 'Budget', 'Mixed'], required: true },
        { id: 'mustHave', question: 'Must-have experiences', type: 'textarea', placeholder: 'What experiences are non-negotiable for you?', required: true },
        { id: 'avoid', question: 'What to avoid', type: 'textarea', placeholder: 'Anything you want to avoid?', required: false },
    ],
};

const TripSignup = () => {
    const { tripType } = useParams<{ tripType: TripType }>();
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const [currentStep, setCurrentStep] = useState(0);
    const [questionnaireData, setQuestionnaireData] = useState<Record<string, any>>({});
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const questions = tripType ? TRIP_QUESTIONS[tripType] : [];
    const totalSteps = questions.length + 1; // Questions + Account creation
    const progress = ((currentStep + 1) / totalSteps) * 100;

    useEffect(() => {
        if (!tripType || !TRIP_QUESTIONS[tripType]) {
            navigate('/get-started');
        }
    }, [tripType, navigate]);

    const handleQuestionAnswer = (questionId: string, value: any) => {
        setQuestionnaireData(prev => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleNext = () => {
        const currentQuestion = questions[currentStep];

        if (currentQuestion?.required && !questionnaireData[currentQuestion.id]) {
            setError('This field is required');
            return;
        }

        setError('');
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setError('');
        setCurrentStep(prev => prev - 1);
    };

    const handleCreateAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        // Save session data BEFORE creating account
        if (tripType) {
            saveSignupSession({
                tripType,
                email,
                fullName,
                questionnaireData,
                timestamp: Date.now(),
            });
        }

        // Create account
        const { error: signUpError } = await signUp(email, password, fullName);

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        // Redirect to login with success message
        navigate('/login?signup=success');
    };

    const isAccountCreationStep = currentStep === questions.length;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-deep via-navy-medium to-navy-deep p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <div className="mb-4">
                            <Progress value={progress} className="h-2" />
                            <p className="text-sm text-muted-foreground mt-2">
                                Step {currentStep + 1} of {totalSteps}
                            </p>
                        </div>
                        <CardTitle className="text-2xl font-display text-foreground">
                            {isAccountCreationStep ? 'Create Your Account' : questions[currentStep]?.question}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            {isAccountCreationStep
                                ? 'Almost done! Create your account to save your preferences'
                                : 'Help us personalize your perfect trip'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4 bg-destructive/10 border-destructive/30">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <AnimatePresence mode="wait">
                            {!isAccountCreationStep ? (
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    {questions[currentStep]?.type === 'text' && (
                                        <Input
                                            type="text"
                                            placeholder={questions[currentStep].placeholder}
                                            value={questionnaireData[questions[currentStep].id] || ''}
                                            onChange={(e) => handleQuestionAnswer(questions[currentStep].id, e.target.value)}
                                            className="bg-background/50 border-border text-lg p-6"
                                            autoFocus
                                        />
                                    )}

                                    {questions[currentStep]?.type === 'number' && (
                                        <Input
                                            type="number"
                                            placeholder={questions[currentStep].placeholder}
                                            value={questionnaireData[questions[currentStep].id] || ''}
                                            onChange={(e) => handleQuestionAnswer(questions[currentStep].id, e.target.value)}
                                            className="bg-background/50 border-border text-lg p-6"
                                            autoFocus
                                        />
                                    )}

                                    {questions[currentStep]?.type === 'textarea' && (
                                        <textarea
                                            placeholder={questions[currentStep].placeholder}
                                            value={questionnaireData[questions[currentStep].id] || ''}
                                            onChange={(e) => handleQuestionAnswer(questions[currentStep].id, e.target.value)}
                                            className="w-full min-h-[150px] bg-background/50 border border-border rounded-md p-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            autoFocus
                                        />
                                    )}

                                    {questions[currentStep]?.type === 'select' && (
                                        <div className="grid grid-cols-1 gap-3">
                                            {questions[currentStep].options?.map((option) => (
                                                <Button
                                                    key={option}
                                                    type="button"
                                                    variant={questionnaireData[questions[currentStep].id] === option ? 'default' : 'outline'}
                                                    className="w-full text-lg py-6"
                                                    onClick={() => handleQuestionAnswer(questions[currentStep].id, option)}
                                                >
                                                    {option}
                                                </Button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-between mt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleBack}
                                            disabled={currentStep === 0}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                        <Button type="button" onClick={handleNext}>
                                            Next
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="account-creation"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleCreateAccount}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="fullName"
                                                type="text"
                                                placeholder="John Doe"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="pl-10 bg-background/50 border-border"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-foreground">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="your@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10 bg-background/50 border-border"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-foreground">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-10 bg-background/50 border-border"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="pl-10 bg-background/50 border-border"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-6">
                                        <Button type="button" variant="outline" onClick={handleBack}>
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                        <Button type="submit" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                'Create Account'
                                            )}
                                        </Button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default TripSignup;
