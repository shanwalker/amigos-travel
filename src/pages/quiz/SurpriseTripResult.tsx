import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Gift, Shield, Mail, Calendar, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface QuizProfile {
    personality: string;
    interests: string[];
    duration: string;
    budget: { min: number; max: number };
    travelStyle: string;
}

const SurpriseTripResult = () => {
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
                navigate('/quiz');
            }
        } else {
            navigate('/quiz');
        }
    }, [navigate]);

    const handleCommit = () => {
        toast({
            title: "Exciting! 🎉",
            description: "We'll start planning your surprise adventure!",
        });
        // In production, navigate to booking/payment flow
        navigate('/signup/surprise');
    };

    const handleBrowseInstead = () => {
        navigate('/dashboard/trips');
    };

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const estimatedPrice = `₹${profile.budget.min.toLocaleString('en-IN')} - ₹${profile.budget.max.toLocaleString('en-IN')}`;

    return (
        <div className="min-h-screen bg-background">
            <Navbar currentVersion="v1" onVersionChange={() => { }} />

            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.2, 0.5, 0.2],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        >
                            <Gift className="w-8 h-8 text-white/30" />
                        </motion.div>
                    ))}
                </div>

                <div className="relative z-10 container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-8"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Mystery Adventure Selected</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
                    >
                        🎁 Your Surprise
                        <br />
                        <span className="text-gradient bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                            Adventure Awaits!
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-white/80 font-sans max-w-3xl mx-auto mb-12"
                    >
                        Get ready for the adventure of a lifetime. We'll reveal your destination
                        as your departure date approaches!
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap items-center justify-center gap-8 text-white/70"
                    >
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-400" />
                            <span className="font-sans">Safe & Vetted Destinations</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            <span className="font-sans">Clues Sent Weekly</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-purple-400" />
                            <span className="font-sans">Packing List Provided</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-16 max-w-6xl">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Trust & Safety */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                                Why Trust Us with a Surprise?
                            </h2>
                            <div className="bg-card border border-border rounded-2xl p-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                            <Shield className="w-6 h-6 text-green-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">Safe & Vetted Destinations</h3>
                                            <p className="text-muted-foreground">
                                                We only send travelers to destinations that are safe, well-reviewed, and perfect for your
                                                travel style. Every location is personally vetted by our team.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">Matched to Your Preferences</h3>
                                            <p className="text-muted-foreground">
                                                Based on your quiz answers, we know you're a <span className="font-semibold text-foreground">
                                                    {profile.personality.replace('_', ' ')}</span> who loves{' '}
                                                <span className="font-semibold text-foreground">{profile.interests.slice(0, 2).join(' and ')}</span>.
                                                Your surprise will reflect this perfectly!
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-6 h-6 text-purple-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2">Gradual Reveal Timeline</h3>
                                            <p className="text-muted-foreground">
                                                We'll send you clues and hints via email as your departure date approaches. You'll receive
                                                your packing list 2 weeks before, and the full destination reveal 1 week before departure.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* How It Works Timeline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                                The Surprise Journey Timeline
                            </h2>
                            <div className="space-y-4">
                                {[
                                    {
                                        week: 'Week 1',
                                        title: 'Booking Confirmed',
                                        description: 'You commit to the surprise and we start planning your perfect adventure.',
                                    },
                                    {
                                        week: 'Week 2-3',
                                        title: 'First Clues Arrive',
                                        description: 'Receive hints about the climate, culture, and activities you can expect.',
                                    },
                                    {
                                        week: 'Week 4',
                                        title: 'Packing List Sent',
                                        description: 'Get a detailed packing list so you know exactly what to bring.',
                                    },
                                    {
                                        week: 'Week 5',
                                        title: 'Destination Revealed!',
                                        description: 'One week before departure, we reveal your destination and full itinerary.',
                                    },
                                    {
                                        week: 'Week 6',
                                        title: 'Adventure Begins',
                                        description: 'Board your flight and embark on the trip of a lifetime!',
                                    },
                                ].map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 p-6 rounded-xl bg-card border border-border"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-primary font-bold">{index + 1}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-primary font-semibold mb-1">{step.week}</div>
                                            <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                                            <p className="text-muted-foreground text-sm">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* FAQ */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                                Frequently Asked Questions
                            </h2>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>What if I don't like the destination?</AccordionTrigger>
                                    <AccordionContent>
                                        We're confident you'll love it! But if you're genuinely unhappy with the reveal,
                                        we offer a full refund up to 7 days before departure, no questions asked.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Can I get a hint about the region?</AccordionTrigger>
                                    <AccordionContent>
                                        Yes! Based on your budget of {estimatedPrice}, we can tell you it will be an
                                        international destination in Asia, known for amazing {profile.interests[0]} experiences.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>What's included in the trip?</AccordionTrigger>
                                    <AccordionContent>
                                        All surprise trips include flights, accommodation, daily breakfast, airport transfers,
                                        and a curated list of activities. Specific inclusions will be revealed with your destination.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>Is it safe to travel to an unknown destination?</AccordionTrigger>
                                    <AccordionContent>
                                        Absolutely! We only select destinations with excellent safety records and strong tourism
                                        infrastructure. All our surprise destinations are places we've personally visited and vetted.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
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
                            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 shadow-xl">
                                <div className="text-center mb-6">
                                    <Gift className="w-16 h-16 text-primary mx-auto mb-4" />
                                    <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                                        Your Surprise Package
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Customized for your preferences
                                    </p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between py-3 border-b border-border">
                                        <span className="text-muted-foreground">Duration</span>
                                        <span className="font-semibold text-foreground">{profile.duration} days</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-border">
                                        <span className="text-muted-foreground">Budget Range</span>
                                        <span className="font-semibold text-foreground">{estimatedPrice}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-border">
                                        <span className="text-muted-foreground">Travel Style</span>
                                        <span className="font-semibold text-foreground capitalize">{profile.travelStyle}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <span className="text-muted-foreground">Destination</span>
                                        <span className="font-semibold text-primary">🎁 Surprise!</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCommit}
                                    size="lg"
                                    className="w-full mb-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 animate-glow-pulse"
                                >
                                    I'm In—Surprise Me!
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>

                                <Button
                                    onClick={handleBrowseInstead}
                                    variant="outline"
                                    size="lg"
                                    className="w-full"
                                >
                                    Browse regular trips instead
                                </Button>

                                <p className="text-xs text-muted-foreground text-center mt-6">
                                    🔒 Full refund if unhappy with reveal • Secure booking • No hidden fees
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

export default SurpriseTripResult;
