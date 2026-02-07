import { useParams } from 'react-router-dom';
import { useProposal } from '@/hooks/useProposals';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Plane, DollarSign, Clock, Check, Star, Heart, Sparkles, Award, Users, Shield, Zap, TrendingUp } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import { TripCustomization } from '@/components/proposal/TripCustomization';
import { useTripCustomization, TripCustomizationProvider } from '@/contexts/TripCustomizationContext';

export default function TripProposalViewerV1({ proposal }: { proposal: any }) {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-[hsl(210,75%,15%)] via-[hsl(210,70%,12%)] to-[hsl(210,75%,10%)]">
                <HeroSection proposal={proposal} opacity={opacity} />
                <PersonalGreeting proposal={proposal} />
                <TrustBadges />
                <WhyThisTrip proposal={proposal} />
                <DestinationSection proposal={proposal} />
                <ExperiencesSection proposal={proposal} />
                <ItinerarySection proposal={proposal} />
                <TripCustomization proposal={proposal} />
                <PricingSection proposal={proposal} />
                <SocialProof />
                <CTASection proposal={proposal} />
            </div>
            <FloatingCTA proposal={proposal} />
        </>
    );
}

function HeroSection({ proposal, opacity }: { proposal: any; opacity: any }) {
    return (
        <motion.section
            style={{ opacity }}
            className="relative h-screen flex items-center justify-center overflow-hidden"
        >
            <div className="absolute inset-0">
                {proposal.hero_image_url && (
                    <>
                        <motion.img
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.5 }}
                            src={proposal.hero_image_url}
                            alt={proposal.destination_name}
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                    </>
                )}
            </div>

            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-20 right-20 text-6xl opacity-20">✈️</motion.div>
            <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} className="absolute bottom-40 left-20 text-5xl opacity-20">🌴</motion.div>

            <div className="relative z-10 text-center text-white px-4 max-w-5xl">
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="mb-6">
                    <span className="inline-block px-6 py-2 bg-gradient-to-r from-primary to-[hsl(42,100%,60%)] rounded-full text-sm font-semibold text-[hsl(210,75%,15%)] shadow-lg mb-4">
                        ⭐ EXCLUSIVE OFFER - LIMITED TIME
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-[hsl(42,100%,70%)] to-white">
                        {proposal.title || 'Your Dream Adventure Awaits'}
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="text-xl sm:text-2xl md:text-3xl font-light mb-8 text-white/80"
                >
                    {proposal.destination_tagline || 'A personalized journey crafted just for you'}
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Button
                        size="lg"
                        className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-primary to-[hsl(42,100%,60%)] hover:from-[hsl(42,100%,55%)] hover:to-[hsl(42,100%,65%)] shadow-2xl hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105"
                        onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <Sparkles className="w-5 h-5 mr-2" />
                        View Package Details
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="text-lg px-10 py-7 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-[hsl(210,75%,15%)] transition-all duration-300"
                        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
                    >
                        Explore More ↓
                    </Button>
                </motion.div>
            </div>

            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                    <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
                </div>
            </motion.div>
        </motion.section>
    );
}

function PersonalGreeting({ proposal }: { proposal: any }) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="py-16 sm:py-24 px-4"
        >
            <div className="container mx-auto max-w-4xl text-center">
                <motion.div initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="text-6xl sm:text-7xl mb-6">
                    👋
                </motion.div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-white">
                    Hey Sravan!
                </h2>
                <p className="text-xl sm:text-2xl text-white/90 leading-relaxed mb-8">
                    We've been working on something <span className="font-bold text-primary">absolutely incredible</span> for you.
                    Based on everything you told us about your dream trip, we've crafted a
                    <span className="font-bold text-primary"> once-in-a-lifetime experience</span> that's going to blow your mind! 🎉
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full border border-primary/30">
                        <Heart className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-white">Handpicked Just for You</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full border border-primary/30">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-white">100% Customized</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full border border-primary/30">
                        <Award className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-white">Premium Quality</span>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

function TrustBadges() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    const badges = [
        { icon: '🏆', text: '500+ Happy Travelers', color: 'from-yellow-400 to-orange-500' },
        { icon: '⭐', text: '4.9/5 Rating', color: 'from-purple-400 to-pink-500' },
        { icon: '🔒', text: '100% Secure Booking', color: 'from-blue-400 to-cyan-500' },
        { icon: '💯', text: 'Best Price Guarantee', color: 'from-green-400 to-emerald-500' },
    ];

    return (
        <section ref={ref} className="py-12 bg-gradient-to-r from-[hsl(210,60%,20%)] to-[hsl(210,70%,15%)] border-y border-primary/20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {badges.map((badge, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="text-center text-white"
                        >
                            <div className="text-4xl sm:text-5xl mb-2">{badge.icon}</div>
                            <p className="font-semibold text-sm sm:text-base">{badge.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function WhyThisTrip({ proposal }: { proposal: any }) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    if (!proposal.matched_preferences) return null;

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="py-16 sm:py-24 px-4 bg-[hsl(210,65%,18%)]"
        >
            <div className="container mx-auto max-w-6xl">
                <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4"
                >
                    Why We Chose This For You 🎯
                </motion.h2>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.2 }}
                    className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto"
                >
                    This isn't just any trip - it's <span className="font-bold text-primary">YOUR perfect match</span> based on your unique preferences
                </motion.p>

                <div className="grid md:grid-cols-2 gap-6">
                    {proposal.matched_preferences.vibe && proposal.matched_preferences.vibe.length > 0 && (
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={inView ? { x: 0, opacity: 1 } : {}}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="p-6 sm:p-8 bg-gradient-to-br from-[hsl(210,60%,25%)] to-[hsl(210,65%,20%)] border-primary/20 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-shadow duration-300">
                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                                    <Sparkles className="w-6 h-6 text-primary" />
                                    Your Vibe
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {proposal.matched_preferences.vibe.map((v: string, i: number) => (
                                        <span key={i} className="px-4 py-2 bg-primary/20 rounded-full text-primary border border-primary/30 font-semibold shadow-md">
                                            {v}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {proposal.matched_preferences.main_thing && (
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={inView ? { x: 0, opacity: 1 } : {}}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="p-6 sm:p-8 bg-gradient-to-br from-[hsl(210,60%,25%)] to-[hsl(210,65%,20%)] border-primary/20 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-shadow duration-300">
                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                                    <Star className="w-6 h-6 text-primary" />
                                    What You Wanted Most
                                </h3>
                                <p className="text-lg text-white/90 font-medium">{proposal.matched_preferences.main_thing}</p>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.section>
    );
}

function DestinationSection({ proposal }: { proposal: any }) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 py-16 sm:py-24"
        >
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block px-6 py-2 bg-gradient-to-r from-primary to-[hsl(42,100%,60%)] rounded-full text-[hsl(210,75%,15%)] font-semibold mb-4">
                        🌍 YOUR DESTINATION
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-white">
                        {proposal.destination_name}
                    </h2>
                    {proposal.destination_description && (
                        <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                            {proposal.destination_description}
                        </p>
                    )}
                </motion.div>

                {proposal.destination_highlights && proposal.destination_highlights.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {proposal.destination_highlights.map((highlight: string, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="flex items-start gap-3 p-4 bg-gradient-to-br from-[hsl(210,60%,22%)] to-[hsl(210,65%,18%)] rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-shadow border border-primary/10"
                            >
                                <Check className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-white/90 font-medium">{highlight}</span>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.section>
    );
}

function ExperiencesSection({ proposal }: { proposal: any }) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    if (!proposal.booked_experiences || proposal.booked_experiences.length === 0) return null;

    return (
        <section ref={ref} className="bg-gradient-to-br from-[hsl(210,70%,10%)] to-[hsl(210,75%,8%)] py-16 sm:py-24 border-y border-primary/10">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                        🎉 Your Epic Experiences
                    </h2>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Get ready for <span className="text-primary font-bold">{proposal.booked_experiences.length} unforgettable adventures</span> that'll make your friends jealous!
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {proposal.booked_experiences.map((exp: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                        >
                            <Card className="overflow-hidden bg-[hsl(210,60%,20%)] hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 h-full group border border-primary/20">
                                {exp.image_url && (
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={exp.image_url}
                                            alt={exp.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        {exp.category && (
                                            <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-[hsl(42,100%,60%)] text-[hsl(210,75%,15%)] px-3 py-1 rounded-full text-xs font-bold">
                                                {exp.category}
                                            </div>
                                        )}
                                        {exp.icon && (
                                            <div className="absolute bottom-3 left-3 text-4xl">
                                                {exp.icon}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-white">
                                        {exp.title}
                                    </h3>
                                    <p className="text-white/70">{exp.description}</p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ItinerarySection({ proposal }: { proposal: any }) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 py-16 sm:py-24"
        >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12">
                📅 Your Trip Timeline
            </h2>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {proposal.departure_date && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="p-6 text-center bg-gradient-to-br from-[hsl(210,60%,22%)] to-[hsl(210,65%,18%)] border-primary/20 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-shadow">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-primary" />
                            <h3 className="font-bold text-lg mb-1 text-white">Departure</h3>
                            <p className="text-2xl font-bold text-primary">
                                {new Date(proposal.departure_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </Card>
                    </motion.div>
                )}

                {proposal.duration_days && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="p-6 text-center bg-gradient-to-br from-[hsl(210,60%,22%)] to-[hsl(210,65%,18%)] border-primary/20 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-shadow">
                            <Clock className="w-12 h-12 mx-auto mb-3 text-primary" />
                            <h3 className="font-bold text-lg mb-1 text-white">Duration</h3>
                            <p className="text-2xl font-bold text-primary">{proposal.duration_days} Days</p>
                            <p className="text-sm text-white/60 mt-1">of pure adventure!</p>
                        </Card>
                    </motion.div>
                )}

                {proposal.return_date && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="p-6 text-center bg-gradient-to-br from-[hsl(210,60%,22%)] to-[hsl(210,65%,18%)] border-primary/20 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-shadow">
                            <Plane className="w-12 h-12 mx-auto mb-3 text-primary" />
                            <h3 className="font-bold text-lg mb-1 text-white">Return</h3>
                            <p className="text-2xl font-bold text-primary">
                                {new Date(proposal.return_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </Card>
                    </motion.div>
                )}
            </div>
        </motion.section>
    );
}

function PricingSection({ proposal }: { proposal: any }) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    const { totalPrice, travelers } = useTripCustomization();
    const [count, setCount] = useState(0);

    // Recalculate deposit based on new total price
    const depositAmount = proposal.deposit_percentage
        ? Math.round(totalPrice * (proposal.deposit_percentage / 100))
        : proposal.deposit_amount || 0;

    useEffect(() => {
        if (inView) {
            const target = totalPrice;
            console.log('Animating price to:', target);
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }
    }, [inView, totalPrice]);

    return (
        <motion.section
            id="pricing"
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-[hsl(210,70%,12%)] via-[hsl(210,65%,15%)] to-[hsl(210,70%,10%)] py-16 sm:py-24 border-y border-primary/20"
        >
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={inView ? { scale: 1 } : {}}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="mb-6"
                    >
                        <div className="inline-block px-6 py-2 bg-primary text-[hsl(210,75%,15%)] rounded-full font-bold mb-4">
                            💰 SPECIAL PRICING - TODAY ONLY
                        </div>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                        Your All-Inclusive Package
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Everything you need for the perfect trip, bundled together
                    </p>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-7xl sm:text-8xl md:text-9xl font-black my-12"
                    >
                        ₹{count.toLocaleString()}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.3 }}
                        className="mb-8 text-white/80"
                    >
                        <p className="text-lg font-medium mb-2">For {totalPrice === proposal.total_price ? '1 Traveler' : `${travelers.length} Travelers`}</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {travelers.map(t => (
                                <span key={t.id} className="bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-white/10">
                                    {t.name}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {proposal.flexible_payments && proposal.deposit_amount && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={inView ? { y: 0, opacity: 1 } : {}}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="p-6 sm:p-8 bg-[hsl(210,60%,18%)]/80 backdrop-blur-lg border-primary/30 text-left max-w-2xl mx-auto">
                                <h3 className="text-2xl font-bold mb-6 text-center">💳 Flexible Payment Plan</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-lg">
                                        <span>Pay Now ({proposal.deposit_percentage}%)</span>
                                        <span className="text-3xl font-bold text-primary">₹{depositAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="h-px bg-primary/20" />
                                    <div className="flex justify-between items-center text-lg text-white/75">
                                        <span>Remaining Balance</span>
                                        <span className="text-xl">₹{(totalPrice - depositAmount).toLocaleString()}</span>
                                    </div>
                                    {proposal.payment_deadline && (
                                        <p className="text-sm text-center pt-4 text-white/60">
                                            Full balance due by {new Date(proposal.payment_deadline).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {proposal.expiry_date && new Date(proposal.expiry_date) > new Date() && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={inView ? { scale: 1, opacity: 1 } : {}}
                            transition={{ delay: 0.6 }}
                            className="mt-8 p-4 bg-red-500/20 backdrop-blur-sm rounded-lg border-2 border-red-400/50"
                        >
                            <p className="text-lg font-bold">
                                ⏰ This offer expires on {new Date(proposal.expiry_date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                            <p className="text-sm mt-1">Don't miss out on this amazing deal!</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.section>
    );
}

function SocialProof() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    const testimonials = [
        { name: 'Priya S.', trip: 'Bali', text: 'Best trip of my life! Everything was perfect!', rating: 5, avatar: '👩' },
        { name: 'Rahul M.', trip: 'Thailand', text: 'Exceeded all expectations. Highly recommend!', rating: 5, avatar: '👨' },
        { name: 'Ananya K.', trip: 'Maldives', text: 'Dream vacation! Worth every rupee!', rating: 5, avatar: '👩‍🦱' },
    ];

    return (
        <section ref={ref} className="py-16 sm:py-24 px-4 bg-[hsl(210,65%,18%)]">
            <div className="container mx-auto max-w-6xl">
                <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12"
                >
                    💬 What Our Travelers Say
                </motion.h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.2 }}
                        >
                            <Card className="p-6 bg-[hsl(210,60%,20%)] shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-shadow h-full border border-primary/20">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-4xl">{testimonial.avatar}</div>
                                    <div>
                                        <h4 className="font-bold">{testimonial.name}</h4>
                                        <p className="text-sm text-white/60">{testimonial.trip}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-3">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                                    ))}
                                </div>
                                <p className="text-white/80 italic">"{testimonial.text}"</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTASection({ proposal }: { proposal: any }) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 py-20 sm:py-32"
        >
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-6xl sm:text-7xl mb-6"
                >
                    🎊
                </motion.div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-white">
                    Ready to Make This Happen?
                </h2>
                <p className="text-xl sm:text-2xl text-white/90 leading-relaxed mb-8">
                    Your dream trip is just <span className="font-bold text-primary">one click away</span>.
                    Secure your spot with just a {proposal.deposit_percentage || 25}% deposit today!
                </p>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mb-8"
                >
                    <Button
                        size="lg"
                        className="text-xl px-16 py-8 rounded-full bg-gradient-to-r from-primary via-[hsl(42,100%,55%)] to-[hsl(42,100%,60%)] hover:from-[hsl(42,100%,55%)] hover:via-[hsl(42,100%,60%)] hover:to-[hsl(42,100%,65%)] shadow-2xl hover:shadow-primary/50 transition-all duration-300"
                        onClick={() => {
                            if (proposal.reservation_url) {
                                window.location.href = proposal.reservation_url;
                            }
                        }}
                    >
                        <Sparkles className="w-6 h-6 mr-3" />
                        Book Now & Save Your Spot!
                        <Sparkles className="w-6 h-6 ml-3" />
                    </Button>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span>100% Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        <span>Instant Confirmation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <span>24/7 Support</span>
                    </div>
                </div>

                <p className="mt-8 text-sm text-gray-500">
                    Questions? Contact us at <a href="mailto:support@thetravelamigo.com" className="text-primary hover:underline font-semibold">support@thetravelamigo.com</a>
                </p>
            </div>
        </motion.section>
    );
}

function FloatingCTA({ proposal }: { proposal: any }) {
    const [show, setShow] = useState(false);
    const { totalPrice } = useTripCustomization();

    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY > 800);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: show ? 0 : 100, opacity: show ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[hsl(210,70%,15%)] to-[hsl(210,65%,12%)] shadow-2xl border-t border-primary/20"
        >
            <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-white text-center sm:text-left">
                    <p className="font-bold text-lg">{proposal.destination_name}</p>
                    <p className="text-sm text-white/80">₹{totalPrice.toLocaleString()} - Limited Time Offer!</p>
                </div>
                <Button
                    size="lg"
                    className="bg-primary text-[hsl(210,75%,15%)] hover:bg-[hsl(42,100%,55%)] font-bold px-8 py-6 rounded-full shadow-xl"
                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Book Now!
                </Button>
            </div>
        </motion.div>
    );
}
