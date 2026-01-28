import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MessageCircle, Calendar, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
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

const CustomTripResult = () => {
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

    const handleScheduleCall = () => {
        toast({
            title: "Opening calendar...",
            description: "Choose a time that works for you!",
        });
        // In production, open Calendly or similar booking widget
        window.open('https://calendly.com/travelamigo', '_blank');
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent(
            `Hi! I just completed the Travel Quiz and I'm interested in a custom trip. My preferences: ${profile?.personality}, ${profile?.interests.join(', ')}, ${profile?.duration} days, Budget: ₹${profile?.budget.min}-${profile?.budget.max}`
        );
        window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
    };

    const handleEmail = () => {
        const subject = encodeURIComponent('Custom Trip Request from Travel Quiz');
        const body = encodeURIComponent(
            `Hi Travel Amigo Team,\n\nI just completed your Travel Quiz and I'm interested in creating a custom trip.\n\nMy preferences:\n- Personality: ${profile?.personality}\n- Interests: ${profile?.interests.join(', ')}\n- Duration: ${profile?.duration} days\n- Budget: ₹${profile?.budget.min}-${profile?.budget.max}\n- Travel Style: ${profile?.travelStyle}\n\nLooking forward to hearing from you!\n\nBest regards`
        );
        window.location.href = `mailto:hello@travelamigo.com?subject=${subject}&body=${body}`;
    };

    const handleBrowseTrips = () => {
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
            <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }} />
                </div>

                <div className="relative z-10 container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-8"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Custom Experience Selected</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
                    >
                        Let's Build Your
                        <br />
                        <span className="text-gradient bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                            Dream Trip Together
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-white/80 font-sans max-w-3xl mx-auto"
                    >
                        Work with our expert travel planners to create a completely personalized
                        itinerary tailored to your unique preferences
                    </motion.p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-16 max-w-6xl">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Your Preferences Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                                We Heard You Loud and Clear
                            </h2>
                            <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20 rounded-2xl p-8">
                                <p className="text-lg text-foreground mb-6">
                                    Based on your quiz, here's what we know about your dream trip:
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">Travel Personality</h3>
                                            <p className="text-muted-foreground capitalize">{profile.personality.replace('_', ' ')}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">Interests</h3>
                                            <p className="text-muted-foreground">{profile.interests.join(', ')}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">Duration</h3>
                                            <p className="text-muted-foreground">{profile.duration} days</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">Budget</h3>
                                            <p className="text-muted-foreground">{estimatedPrice}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">Travel Style</h3>
                                            <p className="text-muted-foreground capitalize">{profile.travelStyle}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* How Custom Trips Work */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                                How Custom Trips Work
                            </h2>
                            <div className="space-y-6">
                                {[
                                    {
                                        step: '01',
                                        title: 'Initial Consultation',
                                        description: 'We\'ll have a 30-minute call to understand your vision, preferences, and any special requirements.',
                                        color: 'from-blue-500 to-cyan-500',
                                    },
                                    {
                                        step: '02',
                                        title: 'Itinerary Design',
                                        description: 'Our experts craft a detailed, day-by-day itinerary with handpicked accommodations, activities, and experiences.',
                                        color: 'from-purple-500 to-pink-500',
                                    },
                                    {
                                        step: '03',
                                        title: 'Review & Refine',
                                        description: 'You review the proposal and we make unlimited revisions until it\'s absolutely perfect.',
                                        color: 'from-orange-500 to-red-500',
                                    },
                                    {
                                        step: '04',
                                        title: 'Book & Travel',
                                        description: 'Once approved, we handle all bookings and provide 24/7 support throughout your journey.',
                                        color: 'from-green-500 to-emerald-500',
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-6 p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow"
                                    >
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                                            <span className="text-white font-bold text-xl">{item.step}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Why Choose Custom */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                                Why Choose a Custom Trip?
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    {
                                        icon: '🎯',
                                        title: 'Perfectly Tailored',
                                        description: 'Every detail matches your exact preferences and pace',
                                    },
                                    {
                                        icon: '⏰',
                                        title: 'Flexible Schedule',
                                        description: 'Travel on your dates, not ours',
                                    },
                                    {
                                        icon: '🏨',
                                        title: 'Handpicked Stays',
                                        description: 'Accommodations chosen specifically for you',
                                    },
                                    {
                                        icon: '🎭',
                                        title: 'Unique Experiences',
                                        description: 'Access to exclusive activities and local secrets',
                                    },
                                    {
                                        icon: '👨‍👩‍👧‍👦',
                                        title: 'Private or Group',
                                        description: 'Choose to travel solo, with family, or join others',
                                    },
                                    {
                                        icon: '💎',
                                        title: 'Premium Service',
                                        description: '24/7 concierge support throughout your journey',
                                    },
                                ].map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border"
                                    >
                                        <div className="text-4xl">{benefit.icon}</div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Contact Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="sticky top-24 space-y-6"
                        >
                            {/* Main CTA Card */}
                            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-8 shadow-xl">
                                <h3 className="font-serif text-2xl font-bold text-foreground mb-2 text-center">
                                    Let's Start Planning
                                </h3>
                                <p className="text-sm text-muted-foreground text-center mb-8">
                                    Choose how you'd like to connect with our travel experts
                                </p>

                                <div className="space-y-4">
                                    <Button
                                        onClick={handleScheduleCall}
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                                    >
                                        <Calendar className="mr-2 w-5 h-5" />
                                        Schedule a Planning Call
                                    </Button>

                                    <Button
                                        onClick={handleWhatsApp}
                                        size="lg"
                                        variant="outline"
                                        className="w-full border-green-500/50 hover:bg-green-500/10"
                                    >
                                        <MessageCircle className="mr-2 w-5 h-5 text-green-500" />
                                        Chat on WhatsApp
                                    </Button>

                                    <Button
                                        onClick={handleEmail}
                                        size="lg"
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Mail className="mr-2 w-5 h-5" />
                                        Send us an Email
                                    </Button>
                                </div>

                                <div className="mt-8 pt-6 border-t border-border">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                        <Phone className="w-4 h-4" />
                                        <span>Or call us directly</span>
                                    </div>
                                    <a
                                        href="tel:+919876543210"
                                        className="text-lg font-semibold text-primary hover:underline"
                                    >
                                        +91 98765 43210
                                    </a>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Mon-Sat, 10 AM - 7 PM IST
                                    </p>
                                </div>
                            </div>

                            {/* Alternative Option */}
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <h4 className="font-semibold text-foreground mb-2">
                                    Not ready for custom?
                                </h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Browse our curated group trips instead
                                </p>
                                <Button
                                    onClick={handleBrowseTrips}
                                    variant="outline"
                                    size="lg"
                                    className="w-full"
                                >
                                    Browse Existing Trips
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>

                            {/* Trust Badge */}
                            <div className="text-center text-xs text-muted-foreground">
                                <p>🔒 Your information is safe with us</p>
                                <p className="mt-1">No obligation • Free consultation</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CustomTripResult;
