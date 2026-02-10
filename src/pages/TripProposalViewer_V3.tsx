import { useParams } from 'react-router-dom';
import { useProposal } from '@/hooks/useProposals';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Plane, Clock, Check, Star, Heart, Sparkles, Award, Users, Shield, Zap, TrendingUp, Eye, Flame, Timer, Compass, Globe } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { TripCustomization } from '@/components/proposal/TripCustomization';
import { useTripCustomization, TripCustomizationProvider } from '@/contexts/TripCustomizationContext';

export default function TripProposalViewerV3({ proposal }: { proposal: any }) {
    const { scrollYProgress } = useScroll();

    return (
        <div className="min-h-screen bg-[hsl(210,75%,15%)] relative overflow-hidden">
            {/* Animated Background Layers */}
            <AnimatedSkyBackground />
            <FloatingClouds />
            <TravelParticles />

            {/* Content */}
            <HeroWithGlobe proposal={proposal} scrollProgress={scrollYProgress} />
            <JourneyTimeline proposal={proposal} />
            <DestinationReveal proposal={proposal} />
            <ExperiencesCarousel proposal={proposal} />
            <TripCustomization proposal={proposal} className="relative z-10" />
            <PricingWithAnimation proposal={proposal} />
            <TestimonialsSlider />
            <FinalCTA proposal={proposal} />

            {/* Fixed Elements */}
            <FloatingBookButton proposal={proposal} />
            <ScrollProgress scrollProgress={scrollYProgress} />
        </div>
    );
}

// 🌅 Animated Sky Background with Day/Night Cycle
function AnimatedSkyBackground() {
    return (
        <div className="fixed inset-0 z-0">
            {/* Gradient sky */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    background: [
                        'linear-gradient(to bottom, hsl(210, 75%, 15%), hsl(210, 70%, 12%))',
                        'linear-gradient(to bottom, hsl(220, 60%, 20%), hsl(210, 70%, 12%))',
                        'linear-gradient(to bottom, hsl(210, 75%, 15%), hsl(210, 70%, 12%))',
                    ],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            {/* Stars */}
            {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 50}%`,
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            {/* Sun/Moon */}
            <motion.div
                className="absolute top-20 right-20 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200 to-orange-400 shadow-[0_0_60px_rgba(255,193,7,0.6)]"
                animate={{
                    y: [0, -30, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
        </div>
    );
}

// ☁️ Floating Clouds with Parallax
function FloatingClouds() {
    const clouds = [
        { size: 'w-64 h-32', speed: 40, delay: 0, y: '10%' },
        { size: 'w-48 h-24', speed: 60, delay: 5, y: '25%' },
        { size: 'w-56 h-28', speed: 50, delay: 10, y: '40%' },
        { size: 'w-40 h-20', speed: 70, delay: 15, y: '15%' },
    ];

    return (
        <div className="fixed inset-0 z-[1] pointer-events-none">
            {clouds.map((cloud, i) => (
                <motion.div
                    key={i}
                    className={`absolute ${cloud.size} opacity-10`}
                    style={{ top: cloud.y }}
                    animate={{
                        x: ['-20%', '120%'],
                    }}
                    transition={{
                        duration: cloud.speed,
                        repeat: Infinity,
                        delay: cloud.delay,
                        ease: 'linear',
                    }}
                >
                    <svg viewBox="0 0 200 100" className="w-full h-full fill-white">
                        <ellipse cx="60" cy="60" rx="50" ry="30" />
                        <ellipse cx="100" cy="50" rx="60" ry="40" />
                        <ellipse cx="140" cy="60" rx="50" ry="30" />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}

// ✨ Travel-Themed Particles (planes, compasses, stars)
function TravelParticles() {
    const icons = ['✈️', '🧭', '⭐', '🌍', '📍', '🎒'];

    return (
        <div className="fixed inset-0 z-[2] pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-2xl opacity-20"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: window.innerHeight + 100,
                    }}
                    animate={{
                        y: -100,
                        x: Math.random() * window.innerWidth,
                        rotate: 360,
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        ease: 'linear',
                    }}
                >
                    {icons[Math.floor(Math.random() * icons.length)]}
                </motion.div>
            ))}
        </div>
    );
}

// 🌍 Hero with Rotating Globe
function HeroWithGlobe({ proposal, scrollProgress }: any) {
    const globeRotation = useTransform(scrollProgress, [0, 1], [0, 360]);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                {proposal.hero_image_url && (
                    <>
                        <motion.img
                            initial={{ scale: 1.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 2 }}
                            src={proposal.hero_image_url}
                            alt={proposal.destination_name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
                    </>
                )}
            </div>

            {/* Rotating Globe */}
            <motion.div
                className="absolute left-10 md:left-20 top-1/4 w-32 h-32 md:w-48 md:h-48 opacity-30"
                style={{ rotate: globeRotation }}
            >
                <Globe className="w-full h-full text-primary" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    {/* Animated Badge */}
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            boxShadow: [
                                '0 0 20px rgba(255,193,7,0.3)',
                                '0 0 40px rgba(255,193,7,0.6)',
                                '0 0 20px rgba(255,193,7,0.3)',
                            ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block px-6 py-3 bg-gradient-to-r from-primary via-yellow-400 to-primary rounded-full mb-8"
                        style={{ backgroundSize: '200% 100%' }}
                    >
                        <motion.span
                            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="font-bold text-[hsl(210,75%,15%)] flex items-center gap-2"
                        >
                            <Flame className="w-5 h-5" />
                            YOUR DREAM TRIP AWAITS
                        </motion.span>
                    </motion.div>

                    {/* Animated Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
                        {proposal.title?.split(' ').map((word: string, i: number) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                                className="inline-block mr-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-primary"
                                style={{ backgroundSize: '200% 100%' }}
                            >
                                <motion.span
                                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                    transition={{ duration: 5, repeat: Infinity, delay: i * 0.2 }}
                                >
                                    {word}
                                </motion.span>
                            </motion.span>
                        ))}
                    </h1>

                    {/* Subtitle with Typewriter Effect */}
                    <TypewriterText text={proposal.destination_tagline || 'Your personalized journey begins here'} />

                    {/* CTA with Ripple Effect */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, duration: 0.6 }}
                        className="mt-12"
                    >
                        <RippleButton onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Explore Your Journey
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="ml-2"
                            >
                                →
                            </motion.div>
                        </RippleButton>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-2"
            >
                <span className="text-sm">Scroll to explore</span>
                <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-primary rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
}

// ⌨️ Typewriter Effect
function TypewriterText({ text }: { text: string }) {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 50);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text]);

    return (
        <p className="text-xl md:text-3xl text-white/90 font-light min-h-[2em]">
            {displayText}
            <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-0.5 h-8 bg-primary ml-1"
            />
        </p>
    );
}

// 🎯 Ripple Button
function RippleButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();

        setRipples(prev => [...prev, { x, y, id }]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);

        onClick();
    };

    return (
        <button
            onClick={handleClick}
            className="relative px-12 py-6 text-lg font-bold bg-gradient-to-r from-primary to-yellow-400 text-[hsl(210,75%,15%)] rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 overflow-hidden group"
        >
            {ripples.map(ripple => (
                <motion.span
                    key={ripple.id}
                    className="absolute bg-white/30 rounded-full"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                    }}
                    initial={{ width: 0, height: 0, x: '-50%', y: '-50%' }}
                    animate={{ width: 500, height: 500, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                />
            ))}
            <span className="relative z-10 flex items-center">{children}</span>
        </button>
    );
}

// 🗺️ Journey Timeline with Animated Path
function JourneyTimeline({ proposal }: any) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    // Use actual proposal dates if available
    const milestones = [
        { icon: '📅', title: 'Book Now', desc: 'Secure your spot', date: 'Today' },
        { icon: '✈️', title: 'Departure', desc: 'SFO → ' + proposal.destination_name, date: proposal.departure_date ? new Date(proposal.departure_date).toLocaleDateString() : 'TBD' },
        { icon: '🌴', title: 'Adventure', desc: `${proposal.duration_days || 7} days of pure bliss`, date: 'Duration' },
        { icon: '🏠', title: 'Return', desc: 'Memories to last forever', date: proposal.return_date ? new Date(proposal.return_date).toLocaleDateString() : 'TBD' },
    ];

    return (
        <section ref={ref} className="relative z-10 py-24 px-4 bg-[hsl(210,65%,18%)]/50 backdrop-blur-sm">
            <div className="container mx-auto max-w-6xl">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    className="text-4xl md:text-6xl font-black text-center mb-16 text-white"
                >
                    Your Journey Timeline
                </motion.h2>

                <div className="relative">
                    {/* Animated Path */}
                    <svg className="absolute top-20 left-0 w-full h-full hidden md:block" style={{ zIndex: 0, overflow: 'visible' }}>
                        <motion.path
                            d="M 150 40 Q 300 150, 450 40 T 750 40 Q 900 150, 1050 40"
                            stroke="url(#timelineGradient)"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray="10 10"
                            initial={{ pathLength: 0 }}
                            animate={inView ? { pathLength: 1 } : {}}
                            transition={{ duration: 2, ease: 'easeInOut' }}
                        />
                        <defs>
                            <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="hsl(42, 100%, 50%)" />
                                <stop offset="100%" stopColor="hsl(42, 100%, 70%)" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Milestones */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {milestones.map((milestone, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={inView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: i * 0.2, type: 'spring', stiffness: 200 }}
                                className="text-center bg-[hsl(210,60%,20%)]/80 p-6 rounded-2xl border border-primary/20 backdrop-blur-md"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-yellow-400 rounded-full flex items-center justify-center text-4xl shadow-xl shadow-primary/30"
                                >
                                    {milestone.icon}
                                </motion.div>
                                <h3 className="text-xl font-bold text-white mb-1">{milestone.title}</h3>
                                <p className="text-primary font-bold mb-2">{milestone.date}</p>
                                <p className="text-white/70 text-sm">{milestone.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// 🗺️ Destination Reveal with Content from V1
function DestinationReveal({ proposal }: any) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <section ref={ref} className="py-24 px-4 relative z-10">
            <div className="container mx-auto max-w-6xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={inView ? { x: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-block px-4 py-2 bg-primary/20 rounded-full text-primary border border-primary/30 mb-6 font-bold">
                            📍 DESTINATION SPOTLIGHT
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                            Welcome to <span className="text-primary">{proposal.destination_name}</span>
                        </h2>
                        {proposal.destination_description && (
                            <p className="text-xl text-white/80 leading-relaxed mb-8">
                                {proposal.destination_description}
                            </p>
                        )}

                        {proposal.destination_highlights && (
                            <div className="space-y-4">
                                {proposal.destination_highlights.map((highlight: string, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={inView ? { x: 0, opacity: 1 } : {}}
                                        transition={{ delay: 0.3 + (i * 0.1) }}
                                        className="flex items-center gap-4 bg-[hsl(210,60%,20%)] p-4 rounded-xl border border-primary/10"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-bold text-lg">✓</div>
                                        <span className="text-white font-medium text-lg">{highlight}</span>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={inView ? { x: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Polaroid Style Image */}
                        <motion.div
                            whileHover={{ rotate: 0, scale: 1.05 }}
                            initial={{ rotate: 3 }}
                            className="bg-white p-4 pb-16 shadow-2xl transform rotate-3 transition-all duration-500"
                        >
                            {proposal.hero_image_url && (
                                <img
                                    src={proposal.hero_image_url}
                                    alt={proposal.destination_name}
                                    className="w-full h-[400px] object-cover filter contrast-110"
                                />
                            )}
                            <div className="absolute bottom-4 left-0 w-full text-center font-handwriting text-2xl text-gray-800 rotate-0">
                                {proposal.destination_name} 2026 📸
                            </div>
                        </motion.div>

                        {/* Decorative Tape */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-10 bg-yellow-200/80 transform -rotate-2" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// 🎢 Experiences Carousel
function ExperiencesCarousel({ proposal }: any) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    if (!proposal.booked_experiences || proposal.booked_experiences.length === 0) return null;

    return (
        <section ref={ref} className="py-24 px-4 bg-[hsl(210,70%,12%)] relative z-10 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ y: 30, opacity: 0 }}
                        animate={inView ? { y: 0, opacity: 1 } : {}}
                        className="text-4xl md:text-6xl font-black text-white mb-4"
                    >
                        Epic Experiences Included
                    </motion.h2>
                    <p className="text-xl text-white/60">Your trip is packed with {proposal.booked_experiences.length} incredible adventures</p>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {proposal.booked_experiences.map((exp: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.15 }}
                            whileHover={{ y: -15, scale: 1.02 }}
                            className="w-full md:w-[350px] group"
                        >
                            <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl">
                                {exp.image_url && (
                                    <div className="absolute inset-0">
                                        <img
                                            src={exp.image_url}
                                            alt={exp.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                    </div>
                                )}

                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/30">
                                        {exp.category || 'ADVENTURE'}
                                    </span>
                                </div>

                                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{exp.title}</h3>
                                    <p className="text-white/80 line-clamp-3 mb-4 text-sm">{exp.description}</p>
                                    <div className="w-12 h-1 bg-primary rounded-full" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// 💰 Pricing with Counter Animation
function PricingWithAnimation({ proposal }: { proposal: any }) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { totalPrice, travelers } = useTripCustomization();
    const [count, setCount] = useState(0);

    // Recalculate deposit based on new total price
    const depositAmount = proposal.deposit_percentage
        ? Math.round(totalPrice * (proposal.deposit_percentage / 100))
        : proposal.deposit_amount || 0;

    useEffect(() => {
        if (inView) {
            const target = totalPrice;
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) { setCount(target); clearInterval(timer); }
                else { setCount(Math.floor(current)); }
            }, duration / steps);
            return () => clearInterval(timer);
        }
    }, [inView, totalPrice]);

    return (
        <section ref={ref} id="pricing" className="py-24 px-4 relative z-10">
            <div className="container mx-auto max-w-4xl text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    className="bg-gradient-to-br from-[hsl(210,60%,20%)] to-[hsl(210,65%,15%)] p-8 md:p-12 rounded-3xl border border-primary/20 shadow-2xl relative overflow-hidden"
                >
                    {/* Background glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-3xl pointer-events-none" />

                    <div className="inline-block px-6 py-2 bg-primary text-[hsl(210,75%,15%)] rounded-full font-bold mb-8 animate-pulse">
                        💎 ALL-INCLUSIVE PACKAGE
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-4">Total Trip Value</h2>

                    <div className="text-5xl sm:text-7xl md:text-9xl font-black text-white mb-2 tracking-tighter break-words">
                        <span className="text-primary text-3xl sm:text-5xl md:text-7xl align-top">₹</span>
                        {count.toLocaleString()}
                    </div>

                    <div className="mb-8">
                        <p className="text-white/60 mb-2 text-sm uppercase tracking-wider font-bold">
                            For {totalPrice === Number(proposal.total_price) ? '1 Traveler' : `${travelers.length} Travelers`}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {travelers.map(t => (
                                <span key={t.id} className="bg-white/10 px-3 py-1 rounded-full text-xs text-white/80 backdrop-blur-sm border border-white/5">
                                    {t.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto mb-8">
                        {proposal.deposit_amount && (
                            <div className="bg-[hsl(210,75%,15%)]/50 p-4 rounded-xl border border-white/10">
                                <div className="text-sm text-white/60 mb-1">Deposit Required ({proposal.deposit_percentage}%)</div>
                                <div className="text-2xl font-bold text-white">₹{depositAmount.toLocaleString()}</div>
                            </div>
                        )}
                        <div className="bg-[hsl(210,75%,15%)]/50 p-4 rounded-xl border border-white/10">
                            <div className="text-sm text-white/60 mb-1">Remaining Balance</div>
                            <div className="text-2xl font-bold text-white">₹{(totalPrice - depositAmount).toLocaleString()}</div>
                        </div>
                    </div>

                    {proposal.flexible_payments && (
                        <div className="flex items-center justify-center gap-2 text-white/80 text-sm mb-8">
                            <Check className="w-4 h-4 text-green-400" /> Flexible Payment Plans Available
                        </div>
                    )}

                    <Button
                        size="lg"
                        className="w-full md:w-auto text-xl px-12 py-8 rounded-full bg-primary text-[hsl(210,75%,15%)] font-bold shadow-xl hover:bg-yellow-400 hover:scale-105 transition-all"
                        onClick={() => {
                            if (proposal.reservation_url) window.location.href = proposal.reservation_url;
                        }}
                    >
                        Secure Your Spot Now for ₹{proposal.deposit_amount ? proposal.deposit_amount.toLocaleString() : '99'}
                    </Button>

                    {proposal.payment_deadline && (
                        <p className="mt-4 text-sm text-white/40">Full payment due by {new Date(proposal.payment_deadline).toLocaleDateString()}</p>
                    )}
                </motion.div>
            </div>
        </section>
    );
}

// 💬 Testimonials
function TestimonialsSlider() {
    const testimonials = [
        { name: 'Priya S.', trip: 'Bali', text: 'Best trip of my life! Everything was perfect!', rating: 5, avatar: '👩' },
        { name: 'Rahul M.', trip: 'Thailand', text: 'Exceeded all expectations. Highly recommend!', rating: 5, avatar: '👨' },
        { name: 'Ananya K.', trip: 'Maldives', text: 'Dream vacation! Worth every rupee!', rating: 5, avatar: '👩‍🦱' },
    ];

    return (
        <section className="py-24 px-4 bg-[hsl(210,65%,18%)] relative z-10">
            <div className="container mx-auto max-w-6xl text-center">
                <h2 className="text-4xl font-bold text-white mb-16">Loved by Travelers Like You</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="bg-[hsl(210,60%,22%)] p-8 rounded-2xl border border-primary/10 text-left relative"
                        >
                            <div className="absolute -top-6 left-8 text-6xl">❝</div>
                            <p className="text-white/80 italic mb-6 relative z-10 pt-4">{t.text}</p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-2xl">{t.avatar}</div>
                                <div>
                                    <div className="font-bold text-white">{t.name}</div>
                                    <div className="text-xs text-primary font-bold tracking-widest uppercase">{t.trip}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// 🏁 Final Call to Action
function FinalCTA({ proposal }: any) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

    return (
        <section ref={ref} className="py-32 px-4 text-center relative z-10 overflow-hidden">
            <div className="container mx-auto max-w-4xl relative">
                {/* Background flare */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    className="relative z-10"
                >
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-8">Don't Wait!</h2>
                    <p className="text-2xl text-white/80 mb-12">Capture this price before it's gone.</p>

                    <Button
                        size="lg"
                        className="text-2xl px-16 py-10 rounded-full bg-gradient-to-r from-primary to-yellow-500 text-[hsl(210,75%,15%)] font-black shadow-[0_0_40px_rgba(255,193,7,0.4)] hover:shadow-[0_0_60px_rgba(255,193,7,0.6)] hover:scale-105 transition-all"
                        onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        START MY ADVENTURE ✈️
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}

// Fixed Floating Elements
function FloatingBookButton({ proposal }: any) {
    const [show, setShow] = useState(false);
    const { totalPrice } = useTripCustomization();

    useEffect(() => {
        const handleScroll = () => setShow(window.scrollY > 800);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 right-6 z-50"
                >
                    <Button
                        className="bg-primary text-[hsl(210,75%,15%)] font-bold rounded-full shadow-2xl px-8 py-6 text-lg hover:scale-110 transition-transform"
                        onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Book Now <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">₹{totalPrice.toLocaleString()}</span>
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function ScrollProgress({ scrollProgress }: any) {
    const scaleX = useSpring(scrollProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100]"
            style={{ scaleX }}
        />
    );
}

function LoadingScreenV3() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[hsl(210,75%,15%)] text-white">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-8"
            >
                <Compass className="w-24 h-24 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold">Planning your adventure...</h2>
        </div>
    );
}

function NotFoundScreenV3() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[hsl(210,75%,15%)] text-white">
            <div className="text-9xl mb-4">🗺️</div>
            <h1 className="text-4xl font-bold mb-4">Adventure Not Found</h1>
            <p className="text-xl opacity-60">It seems this journey has ended or moved.</p>
        </div>
    );
}
