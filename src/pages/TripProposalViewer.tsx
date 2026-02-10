import { useParams, useSearchParams } from 'react-router-dom';
import { useProposal } from '@/hooks/useProposals';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Plane, DollarSign, Clock, Check, Star, Heart, Sparkles, Award, Users, Shield, Zap, TrendingUp, Eye, Flame, Timer } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Import V1 (Legacy)
import TripProposalViewerV1 from './TripProposalViewer_V1';
// Import V3 (Future)
import TripProposalViewerV3 from './TripProposalViewer_V3';
import { TripCustomization } from '@/components/proposal/TripCustomization';
import { TripCustomizationProvider, useTripCustomization } from '@/contexts/TripCustomizationContext';

export default function TripProposalViewer() {
    const { id } = useParams<{ id: string }>();
    const { data: proposal, isLoading } = useProposal(id);
    const [searchParams, setSearchParams] = useSearchParams();
    const version = searchParams.get('v') || 'v2';

    // Cycle through versions: v1 -> v2 -> v3 -> v1
    const toggleVersion = () => {
        const versions = ['v1', 'v2', 'v3'];
        const currentIndex = versions.indexOf(version);
        const nextIndex = (currentIndex + 1) % versions.length;
        setSearchParams({ v: versions[nextIndex] });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[hsl(210,75%,15%)]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-lg text-white/70">Loading your dream trip...</p>
                </div>
            </div>
        );
    }

    if (!proposal) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[hsl(210,75%,15%)]">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="text-6xl mb-4">✈️</div>
                    <h1 className="text-3xl font-bold mb-2 text-white">Proposal Not Found</h1>
                    <p className="text-white/60">This proposal may have been removed or expired.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <TripCustomizationProvider proposal={proposal}>
            {version === 'v1' && (
                <>
                    <VersionSwitcher version="v1" onToggle={toggleVersion} />
                    <TripProposalViewerV1 proposal={proposal} />
                </>
            )}

            {version === 'v3' && (
                <>
                    <VersionSwitcher version="v3" onToggle={toggleVersion} />
                    <TripProposalViewerV3 proposal={proposal} />
                </>
            )}

            {version === 'v2' && (
                <>
                    <VersionSwitcher version="v2" onToggle={toggleVersion} />
                    <TripProposalViewerV2 proposal={proposal} />
                </>
            )}
        </TripCustomizationProvider>
    );
}

function VersionSwitcher({ version, onToggle }: { version: string; onToggle: () => void }) {
    const nextVersion = version === 'v1' ? 'v2' : version === 'v2' ? 'v3' : 'v1';

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 right-4 z-[100]"
        >
            <Button
                onClick={onToggle}
                className="bg-primary/90 backdrop-blur-lg text-[hsl(210,75%,15%)] hover:bg-primary shadow-xl border-2 border-primary/30 font-bold"
            >
                <Sparkles className="w-4 h-4 mr-2" />
                {version.toUpperCase()} → {nextVersion.toUpperCase()}
            </Button>
        </motion.div>
    );
}

function TripProposalViewerV2({ proposal }: { proposal: any }) {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[hsl(210,75%,15%)] via-[hsl(210,70%,12%)] to-[hsl(210,75%,10%)] relative overflow-hidden">
            <FloatingParticles />
            <AnimatedBackground />

            {/* The Flight Animation Layer */}
            <ScrollFlightAnimation scrollProgress={scrollYProgress} />

            {/* Content Sections */}
            <HeroSectionV2 proposal={proposal} opacity={opacity} />
            <LiveIndicators proposal={proposal} />
            <PersonalGreetingV2 proposal={proposal} />
            <TrustBadgesV2 />
            <WhyThisTripV2 proposal={proposal} />
            <DestinationSectionV2 proposal={proposal} />
            <ExperiencesSectionV2 proposal={proposal} />
            <ItinerarySectionV2 proposal={proposal} />
            <TripCustomization proposal={proposal} />
            <PricingSectionV2 proposal={proposal} />
            <SocialProofV2 />
            <CTASectionV2 proposal={proposal} />
            <FloatingCTAV2 proposal={proposal} />
        </div>
    );
}

// ✈️ SCROLL-TRIGGERED FLIGHT ANIMATION - "AMIGO" BRANDED JET
function ScrollFlightAnimation({ scrollProgress }: { scrollProgress: any }) {
    // Ultra-smooth physics for a "gliding" feel
    const smoothProgress = useSpring(scrollProgress, {
        stiffness: 30, // Softer spring
        damping: 30,   // More damping for stability
        restDelta: 0.001
    });

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 🌊 Elegant, Subtle Flight Path
    // Center -> Slight Right -> Slight Left -> Center
    // Kept narrow to avoid covering content
    const xRange = isMobile
        ? ['50%', '65%', '35%', '55%', '50%']
        : ['50%', '60%', '40%', '55%', '50%'];

    const x = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], xRange);

    // 🔄 Gentle Banking
    const rotate = useTransform(smoothProgress,
        [0, 0.2, 0.25, 0.45, 0.5, 0.7, 0.75, 1],
        [0, 15, 15, -15, -15, 15, 15, 0] // Much subtler rotations (max 15 deg)
    );

    // 🛫 Refined Scaling
    // Increased base scale slightly to make text readable, but still unobtrusive
    const baseScale = isMobile ? 0.8 : 1.0;
    const maxScale = isMobile ? 1.1 : 1.4;
    const scale = useTransform(smoothProgress,
        [0, 0.1, 0.5, 0.9, 1],
        [0.5, maxScale, maxScale, maxScale, 0.5]
    );

    return (
        <div className="fixed inset-0 pointer-events-none z-[40] overflow-hidden">
            {/* The Plane Container */}
            <motion.div
                style={{
                    left: x,
                    top: '50%',
                    rotate: rotate,
                    scale: scale,
                    x: '-50%',
                    y: '-50%'
                }}
                className="absolute z-[40]"
            >
                {/* Sleek Composition */}
                <div className="relative w-32 h-32 md:w-40 md:h-40">

                    {/* Soft Shadow */}
                    <div className="absolute inset-0 translate-y-8 translate-x-4 blur-[8px] opacity-20">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform rotate-90 fill-black">
                            <path d="M50 5 L55 35 L95 55 L95 65 L55 55 L55 85 L70 92 L70 96 L50 94 L30 96 L30 92 L45 85 L45 55 L5 65 L5 55 L45 35 L50 5 Z" />
                        </svg>
                    </div>

                    {/* Faint Contrails */}
                    <div className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 flex flex-col gap-3 opacity-30">
                        <div className="w-40 h-[1px] bg-gradient-to-l from-white to-transparent" />
                        <div className="w-40 h-[1px] bg-gradient-to-l from-white to-transparent" />
                    </div>

                    {/* 🛩️ Branded "Amigo" Private Jet */}
                    <svg viewBox="0 0 100 100" className="w-full h-full transform rotate-90 drop-shadow-xl filter">
                        <defs>
                            <linearGradient id="planeBody" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="50%" stopColor="#f8fafc" />
                                <stop offset="100%" stopColor="#e2e8f0" />
                            </linearGradient>
                            <linearGradient id="amigoBrand" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#f59e0b" /> {/* Amber 500 */}
                                <stop offset="100%" stopColor="#d97706" /> {/* Amber 600 */}
                            </linearGradient>
                        </defs>

                        {/* Fuselage */}
                        <path
                            fill="url(#planeBody)"
                            d="M50 2 C 53 2, 56 15, 56 35 L 56 80 Q 56 90, 50 95 Q 44 90, 44 80 L 44 35 C 44 15, 47 2, 50 2 Z"
                        />

                        {/* Wings */}
                        <path d="M56 40 L 98 60 L 98 68 L 56 55" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
                        <path d="M44 40 L 2 60 L 2 68 L 44 55" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />

                        {/* Tail */}
                        <path d="M54 85 L 68 92 L 68 96 L 53 92" fill="#e2e8f0" />
                        <path d="M46 85 L 32 92 L 32 96 L 47 92" fill="#e2e8f0" />

                        {/* Cockpit */}
                        <path d="M48 12 L 52 12 L 52 18 L 48 18 Z" fill="#1e293b" />

                        {/* Engines */}
                        <path d="M58 70 L 62 70 L 62 82 L 58 82 Z" fill="#334155" />
                        <path d="M42 70 L 38 70 L 38 82 L 42 82 Z" fill="#334155" />

                        {/* Branding Text "Amigo" - rotated 90deg to be legible on the fuselage */}
                        {/* Since the plane is rotated 90deg in CSS, text needs to be upright relative to the fuselage */}
                        <text
                            x="50"
                            y="55"
                            textAnchor="middle"
                            fontSize="6"
                            fontWeight="900"
                            fill="#1e293b"
                            style={{ letterSpacing: '1px', fontFamily: 'sans-serif' }}
                            transform="rotate(-90 50 55)"
                        >
                            AMIGO
                        </text>

                        {/* Accent Stripe */}
                        <path d="M49 65 L 51 65" stroke="url(#amigoBrand)" strokeWidth="12" strokeLinecap="butt" opacity="0.8" />
                    </svg>

                    {/* Beacon Light */}
                    <motion.div
                        className="absolute top-[85%] left-1/2 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] -translate-x-1/2"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </div>
    );
}

// Floating particles background
function FloatingParticles() {
    const particles = Array.from({ length: 15 });

    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 md:w-2 md:h-2 bg-primary/20 rounded-full"
                    initial={{
                        x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                        y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
                    }}
                    animate={{
                        y: typeof window !== 'undefined' ? [null, Math.random() * window.innerHeight] : 0,
                        x: typeof window !== 'undefined' ? [null, Math.random() * window.innerWidth] : 0,
                    }}
                    transition={{
                        duration: 10 + Math.random() * 20,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
}

// Animated gradient mesh background
function AnimatedBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            <motion.div
                className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/10 rounded-full blur-[100px] md:blur-[120px]"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-primary/5 rounded-full blur-[80px] md:blur-[100px]"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                }}
            />
        </div>
    );
}

// Live viewing indicators with countdown - REMOVED VIEWER COUNT
function LiveIndicators({ proposal }: { proposal: any }) {
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        if (!proposal?.expiry_date) return;

        const updateCountdown = () => {
            const now = new Date().getTime();
            const expiry = new Date(proposal.expiry_date).getTime();
            const distance = expiry - now;

            if (distance < 0) {
                setTimeLeft('EXPIRED');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 60000);
        return () => clearInterval(timer);
    }, [proposal?.expiry_date]);

    if (!timeLeft) return null;

    return (
        <div className="fixed top-16 md:top-20 left-4 z-50 flex flex-col gap-2">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/90 backdrop-blur-lg border border-red-400/50 rounded-full px-3 md:px-4 py-2 shadow-xl"
            >
                <div className="flex items-center gap-2">
                    <Timer className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    <span className="text-white text-xs md:text-sm font-bold">{timeLeft}</span>
                </div>
            </motion.div>
        </div>
    );
}

// Enhanced Hero
function HeroSectionV2({ proposal, opacity }: any) {
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

            <div className="relative z-10 text-center text-white px-4 max-w-5xl">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="mb-6"
                >
                    <motion.span
                        animate={{
                            boxShadow: [
                                '0 0 20px rgba(255,193,7,0.3)',
                                '0 0 40px rgba(255,193,7,0.5)',
                                '0 0 20px rgba(255,193,7,0.3)',
                            ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block px-4 md:px-6 py-2 bg-gradient-to-r from-primary to-[hsl(42,100%,60%)] rounded-full text-xs md:text-sm font-semibold text-[hsl(210,75%,15%)] shadow-lg mb-4"
                    >
                        <Flame className="inline w-3 h-3 md:w-4 md:h-4 mr-1" />
                        EXCLUSIVE OFFER - LIMITED TIME
                    </motion.span>
                </motion.div>

                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight"
                >
                    <motion.span
                        animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                        style={{
                            backgroundSize: '200% 200%',
                        }}
                        className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-[hsl(42,100%,70%)] to-white"
                    >
                        {proposal.title || 'Your Dream Adventure Awaits'}
                    </motion.span>
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-6 md:mb-8 text-white/80"
                >
                    {proposal.destination_tagline || 'A personalized journey crafted just for you'}
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                >
                    <MagneticButton
                        onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                        View Package Details
                    </MagneticButton>
                </motion.div>
            </div>
        </motion.section>
    );
}

// Magnetic button with 3D tilt
function MagneticButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setPosition({ x: x * 0.3, y: y * 0.3 });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            className="relative text-base md:text-lg px-8 md:px-10 py-5 md:py-7 rounded-full bg-gradient-to-r from-primary to-[hsl(42,100%,60%)] hover:from-[hsl(42,100%,55%)] hover:to-[hsl(42,100%,65%)] shadow-2xl hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105 overflow-hidden group"
        >
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                animate={{
                    x: ['-100%', '100%'],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
            <span className="relative z-10 flex items-center font-bold text-[hsl(210,75%,15%)]">
                {children}
            </span>
        </motion.button>
    );
}

function PersonalGreetingV2({ proposal }: { proposal: any }) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="py-12 md:py-24 px-4 relative z-10"
        >
            <div className="container mx-auto max-w-4xl text-center">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={inView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="text-5xl md:text-7xl mb-6"
                >
                    👋
                </motion.div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-white">
                    Hey Sravan!
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed mb-6 md:mb-8">
                    We've been working on something <span className="font-bold text-primary">absolutely incredible</span> for you.
                    Based on everything you told us about your dream trip, we've crafted a
                    <span className="font-bold text-primary"> once-in-a-lifetime experience</span> that's going to blow your mind! 🎉
                </p>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-xs sm:text-sm md:text-base">
                    {[
                        { icon: Heart, text: 'Handpicked Just for You' },
                        { icon: Sparkles, text: '100% Customized' },
                        { icon: Award, text: 'Premium Quality' },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-primary/20 rounded-full border border-primary/30 cursor-pointer"
                        >
                            <item.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                            <span className="font-semibold text-white">{item.text}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}

function TrustBadgesV2() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const badges = [
        { icon: '🏆', text: '500+ Happy Travelers', color: 'from-yellow-400 to-orange-500' },
        { icon: '⭐', text: '4.9/5 Rating', color: 'from-purple-400 to-pink-500' },
        { icon: '🔒', text: '100% Secure Booking', color: 'from-blue-400 to-cyan-500' },
        { icon: '💯', text: 'Best Price Guarantee', color: 'from-green-400 to-emerald-500' },
    ];

    return (
        <section ref={ref} className="py-8 md:py-12 bg-gradient-to-r from-[hsl(210,60%,20%)] to-[hsl(210,70%,15%)] border-y border-primary/20 relative z-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                    {badges.map((badge, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="text-center text-white"
                        >
                            <div className="text-3xl md:text-5xl mb-2">{badge.icon}</div>
                            <p className="font-semibold text-xs md:text-base">{badge.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function WhyThisTripV2({ proposal }: { proposal: any }) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    if (!proposal.matched_preferences) return null;

    return (
        <section ref={ref} className="py-16 px-4 bg-[hsl(210,65%,18%)] relative z-10">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">Why This Trip? 🎯</h2>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-6">
                    {proposal.matched_preferences.vibe && (
                        <Card className="p-6 bg-gradient-to-br from-[hsl(210,60%,25%)] to-[hsl(210,65%,20%)] border-primary/20">
                            <h3 className="text-2xl font-bold mb-4 text-white flex gap-2"><Sparkles className="text-primary" /> Vibe Match</h3>
                            <div className="flex flex-wrap gap-2">
                                {proposal.matched_preferences.vibe.map((v: string) => (
                                    <span key={v} className="px-3 py-1 bg-primary/20 rounded-full text-primary border border-primary/30 text-sm font-semibold">{v}</span>
                                ))}
                            </div>
                        </Card>
                    )}
                    {proposal.matched_preferences.main_thing && (
                        <Card className="p-6 bg-gradient-to-br from-[hsl(210,60%,25%)] to-[hsl(210,65%,20%)] border-primary/20">
                            <h3 className="text-2xl font-bold mb-4 text-white flex gap-2"><Star className="text-primary" /> Top Priority</h3>
                            <p className="text-white/90 text-lg">{proposal.matched_preferences.main_thing}</p>
                        </Card>
                    )}
                </div>
            </div>
        </section>
    );
}

function DestinationSectionV2({ proposal }: { proposal: any }) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <section ref={ref} className="py-16 px-4 relative z-10">
            <div className="container mx-auto max-w-5xl text-center">
                <motion.h2
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    className="text-4xl md:text-6xl font-black mb-6 text-white"
                >
                    {proposal.destination_name}
                </motion.h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">{proposal.destination_description}</p>

                {proposal.destination_highlights && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                        {proposal.destination_highlights.map((h: string, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ x: -20, opacity: 0 }}
                                animate={inView ? { x: 0, opacity: 1 } : {}}
                                transition={{ delay: i * 0.1 }}
                                className="p-4 bg-[hsl(210,60%,22%)] rounded-xl border border-primary/10 flex gap-3"
                            >
                                <Check className="text-green-400 shrink-0" />
                                <span className="text-white">{h}</span>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// 3D Tilt Experience Cards
function ExperiencesSectionV2({ proposal }: any) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    if (!proposal.booked_experiences || proposal.booked_experiences.length === 0) return null;

    return (
        <section ref={ref} className="bg-gradient-to-br from-[hsl(210,70%,10%)] to-[hsl(210,75%,8%)] py-12 md:py-24 border-y border-primary/10 relative z-10">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    className="text-center mb-8 md:mb-12"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4">
                        🎉 Your Epic Experiences
                    </h2>
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                        Get ready for <span className="text-primary font-bold">{proposal.booked_experiences.length} unforgettable adventures</span>!
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
                    {proposal.booked_experiences.map((exp: any, i: number) => (
                        <TiltCard key={i} delay={i * 0.15} inView={inView}>
                            <Card className="overflow-hidden bg-[hsl(210,60%,20%)] hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 h-full group border border-primary/20">
                                {exp.image_url && (
                                    <div className="relative h-40 md:h-48 overflow-hidden">
                                        <img
                                            src={exp.image_url}
                                            alt={exp.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        {exp.category && (
                                            <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-[hsl(42,100%,60%)] text-[hsl(210,75%,15%)] px-2 md:px-3 py-1 rounded-full text-xs font-bold">
                                                {exp.category}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="p-4 md:p-6">
                                    <h3 className="text-lg md:text-xl font-bold mb-2 text-white">
                                        {exp.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-white/70">{exp.description}</p>
                                </div>
                            </Card>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
}

// 3D Tilt Card Component
function TiltCard({ children, delay, inView }: { children: React.ReactNode; delay: number; inView: boolean }) {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateXValue = ((y - centerY) / centerY) * -10;
        const rotateYValue = ((x - centerX) / centerX) * 10;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay, duration: 0.5 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transition: 'transform 0.1s ease-out',
            }}
        >
            {children}
        </motion.div>
    );
}

function ItinerarySectionV2({ proposal }: { proposal: any }) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <section ref={ref} className="py-16 px-4 relative z-10">
            <h2 className="text-4xl font-bold text-center text-white mb-12">📅 Trip Timeline</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {/* Simplified timeline for V2 */}
                {[
                    { icon: Calendar, label: 'Departure', val: proposal.departure_date },
                    { icon: Clock, label: 'Duration', val: `${proposal.duration_days} Days` },
                    { icon: Plane, label: 'Return', val: proposal.return_date }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="p-6 text-center bg-[hsl(210,60%,22%)] border-primary/20">
                            <item.icon className="w-10 h-10 mx-auto mb-2 text-primary" />
                            <h3 className="text-white font-bold">{item.label}</h3>
                            <p className="text-primary text-xl font-bold">{
                                item.label === 'Duration' ? item.val : new Date(item.val).toLocaleDateString()
                            }</p>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function PricingSectionV2({ proposal }: { proposal: any }) {
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
        <section ref={ref} className="py-16 px-4 bg-[hsl(210,70%,12%)] relative z-10" id="pricing">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-5xl font-black text-white mb-2">All-Inclusive Price</h2>

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
                <motion.div className="text-8xl font-black text-white mb-8">
                    ₹{count.toLocaleString()}
                </motion.div>
                {proposal.deposit_amount && (
                    <Card className="p-6 bg-[hsl(210,60%,18%)] border-primary/30 max-w-xl mx-auto">
                        <div className="flex justify-between text-white text-lg font-bold">
                            <span>Pay Now ({proposal.deposit_percentage}%)</span>
                            <span className="text-xl">₹{(totalPrice - depositAmount).toLocaleString()}</span>
                        </div>
                        {proposal.payment_deadline && (
                            <p className="text-sm text-center pt-4 text-white/60">
                                Full balance due by {new Date(proposal.payment_deadline).toLocaleDateString()}
                            </p>
                        )}
                    </Card>
                )}
            </div>
        </section>
    );
}

function SocialProofV2() {
    return (
        <section className="py-16 px-4 relative z-10">
            <h2 className="text-3xl font-bold text-center text-white mb-8">Traveler Reviews</h2>
            <div className="flex justify-center gap-4 flex-wrap">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="p-4 bg-[hsl(210,60%,20%)] border-primary/20 w-80">
                        <div className="flex text-yellow-500 mb-2">⭐⭐⭐⭐⭐</div>
                        <p className="text-white/80">"Amazing experience! Best trip ever."</p>
                    </Card>
                ))}
            </div>
        </section>
    );
}

function CTASectionV2({ proposal }: { proposal: any }) {
    return (
        <section className="py-24 px-4 text-center relative z-10">
            <h2 className="text-5xl font-black text-white mb-8">Ready to Go?</h2>
            <Button size="lg" className="text-2xl px-12 py-8 rounded-full bg-primary text-[hsl(210,75%,15%)] font-bold shadow-2xl hover:bg-yellow-400 transition-colors">
                Book Now & Save Spot!
            </Button>
        </section>
    );
}

function FloatingCTAV2({ proposal }: { proposal: any }) {
    const [show, setShow] = useState(false);
    const { totalPrice } = useTripCustomization();

    useEffect(() => {
        const handleScroll = () => setShow(window.scrollY > 800);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.div
            animate={{ y: show ? 0 : 100 }}
            className="fixed bottom-0 left-0 right-0 bg-[hsl(210,75%,15%)]/95 backdrop-blur border-t border-primary/30 p-4 z-50 flex justify-between items-center"
        >
            <div className="text-white font-bold ml-4">
                {proposal.destination_name} - ₹{totalPrice.toLocaleString()}
            </div>
            <Button className="font-bold bg-primary text-[hsl(210,75%,15%)] mr-4" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>Book Now</Button>
        </motion.div>
    );
}
