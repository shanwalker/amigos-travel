import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

interface QuizProfile {
    personality: string;
    interests: string[];
    duration: string;
    budget: { min: number; max: number };
    travelStyle: string;
}

// Mock matched trip data - in production, this would come from your matching algorithm
const mockTrip = {
    id: '1',
    destination: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200',
    price: '₹48,999',
    duration: '7 Days, 6 Nights',
    dates: 'Apr 15 - Apr 22, 2026',
    spotsLeft: 4,
    groupSize: 12,
    highlights: [
        'Ubud Rice Terraces & Monkey Forest',
        'Sunset at Tanah Lot Temple',
        'Beach club hopping in Seminyak',
        'Traditional Balinese cooking class',
        'Snorkeling in Nusa Penida',
    ],
    included: [
        'Accommodation in 4-star hotels',
        'Daily breakfast',
        'Airport transfers',
        'All activities mentioned',
        'Local English-speaking guide',
    ],
};

const personalityDescriptions: Record<string, string> = {
    relaxer: 'You love to unwind and take it slow',
    explorer: 'You seek adventure and hidden gems',
    culture_seeker: 'You appreciate art, history, and traditions',
    night_owl: 'You thrive in vibrant nightlife scenes',
};

const MatchedTripResult = () => {
    const [profile, setProfile] = useState<QuizProfile | null>(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Load quiz profile from localStorage
        const saved = localStorage.getItem('quizProfile');
        if (saved) {
            try {
                setProfile(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load quiz profile', e);
                navigate('/start-quiz');
            }
        } else {
            // No quiz data, redirect to quiz
            navigate('/start-quiz');
        }
    }, [navigate]);

    const handleReserve = () => {
        toast({
            title: "Redirecting to booking...",
            description: "We'll help you secure your spot!",
        });
        // In production, navigate to booking flow
        navigate('/signup/group');
    };

    const handleTryAnother = () => {
        navigate('/start-quiz');
    };

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar currentVersion="v1" onVersionChange={() => { }} />

            {/* Hero Section */}
            <section className="relative h-[60vh] overflow-hidden">
                <img
                    src={mockTrip.image}
                    alt={mockTrip.destination}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="relative z-10 container mx-auto px-6 h-full flex items-end pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-white text-sm font-semibold mb-4"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Perfect Match Found!</span>
                        </motion.div>

                        <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">
                            🎉 We found your perfect getaway:
                            <br />
                            <span className="text-primary">{mockTrip.destination}!</span>
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span className="font-sans">{mockTrip.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                <span className="font-sans">Group of {mockTrip.groupSize}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                <span className="font-sans">{mockTrip.spotsLeft} spots left</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-16 max-w-6xl">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Column - Trip Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Why This Trip */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                                Why This Trip is Perfect for You
                            </h2>
                            <div className="bg-card border border-border rounded-2xl p-8">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Heart className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">Matches Your Personality</h3>
                                            <p className="text-muted-foreground">
                                                As a <span className="font-semibold text-foreground">{profile.personality.replace('_', ' ')}</span>,
                                                {' '}{personalityDescriptions[profile.personality]}. This trip offers the perfect balance of
                                                relaxation and adventure that suits your style.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">Aligns with Your Interests</h3>
                                            <p className="text-muted-foreground">
                                                You selected: <span className="font-semibold text-foreground">
                                                    {profile.interests.join(', ')}
                                                </span>. This destination is renowned for these exact experiences!
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">Perfect Duration</h3>
                                            <p className="text-muted-foreground">
                                                You wanted a <span className="font-semibold text-foreground">{profile.duration} days</span> trip,
                                                and this {mockTrip.duration} itinerary gives you enough time to explore without feeling rushed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Trip Highlights */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                                Trip Highlights
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {mockTrip.highlights.map((highlight, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-primary text-sm font-bold">{index + 1}</span>
                                        </div>
                                        <p className="text-foreground font-sans">{highlight}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* What's Included */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                                What's Included
                            </h2>
                            <div className="bg-card border border-border rounded-2xl p-8">
                                <ul className="space-y-3">
                                    {mockTrip.included.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                            </div>
                                            <span className="text-foreground font-sans">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="sticky top-24"
                        >
                            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                                <div className="mb-6">
                                    <p className="text-sm text-muted-foreground mb-2">Starting from</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-display text-4xl font-bold text-foreground">
                                            {mockTrip.price}
                                        </span>
                                        <span className="text-muted-foreground">/person</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between py-3 border-b border-border">
                                        <span className="text-muted-foreground">Departure</span>
                                        <span className="font-semibold text-foreground">{mockTrip.dates}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-border">
                                        <span className="text-muted-foreground">Duration</span>
                                        <span className="font-semibold text-foreground">{mockTrip.duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <span className="text-muted-foreground">Spots Available</span>
                                        <span className="font-semibold text-primary">{mockTrip.spotsLeft} left</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleReserve}
                                    size="lg"
                                    className="w-full mb-4 animate-glow-pulse"
                                >
                                    Reserve My Spot
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>

                                <Button
                                    onClick={handleTryAnother}
                                    variant="outline"
                                    size="lg"
                                    className="w-full"
                                >
                                    Not quite right? Try another match
                                </Button>

                                <p className="text-xs text-muted-foreground text-center mt-6">
                                    🔒 Secure booking • No hidden fees • Free cancellation up to 30 days
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default MatchedTripResult;
