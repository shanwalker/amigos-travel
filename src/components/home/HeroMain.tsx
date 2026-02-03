import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Users, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import heroVideo from '@/assets/hero-video.mp4';
import heroBg from '@/assets/hero-bg.jpg';
import tripThailand from '@/assets/trip-thailand.jpg';
import tripVietnam from '@/assets/trip-vietnam.jpg';
import tripBali from '@/assets/trip-bali.jpg';
import tripJapan from '@/assets/trip-japan.jpg';
import { MagneticButton } from '../ui/animations';
import { useAuth } from '@/contexts/AuthContext';

// --- Types & Data (Copied from V1) ---
interface Trip {
    id: number;
    destination: string;
    dates: string;
    spotsLeft: number;
    price: string;
    image: string;
    duration: string;
}

const upcomingTrips: Trip[] = [
    {
        id: 1,
        destination: 'Thailand Islands',
        dates: 'Mar 15 - Mar 25',
        spotsLeft: 4,
        price: '₹45,999',
        image: tripThailand,
        duration: '10 Days'
    },
    {
        id: 2,
        destination: 'Vietnam Explorer',
        dates: 'Apr 02 - Apr 12',
        spotsLeft: 6,
        price: '₹52,999',
        image: tripVietnam,
        duration: '10 Days'
    },
    {
        id: 3,
        destination: 'Bali Adventure',
        dates: 'Apr 18 - Apr 28',
        spotsLeft: 3,
        price: '₹48,999',
        image: tripBali,
        duration: '10 Days'
    },
    {
        id: 4,
        destination: 'Japan Sakura',
        dates: 'May 05 - May 15',
        spotsLeft: 8,
        price: '₹89,999',
        image: tripJapan,
        duration: '10 Days'
    },
];

interface TripCardProps {
    trip: Trip;
    index: number;
}

// Memoized TripCard
const TripCard = memo(({ trip, index }: TripCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * (index % 4) }}
            className="flex-shrink-0 w-[280px] h-[380px] rounded-2xl overflow-hidden relative group cursor-pointer"
        >
            <img
                src={trip.image}
                alt={trip.destination}
                loading={index < 4 ? "eager" : "lazy"}
                decoding="async"
                width={280}
                height={380}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full glass-card text-sm font-sans font-semibold text-primary">
                {trip.spotsLeft} spots left
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-serif text-xl font-bold text-white mb-2">{trip.destination}</h3>
                <div className="flex items-center gap-4 text-white/80 text-sm font-sans mb-3">
                    <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>{trip.duration}</span></div>
                    <div className="flex items-center gap-1"><Users className="w-4 h-4" /><span>12 travelers</span></div>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs text-white/60 font-sans">Starting from</span>
                        <div className="text-xl font-display font-bold text-primary">{trip.price}</div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-sans font-medium text-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        View Trip
                    </button>
                </div>
            </div>
        </motion.div>
    );
});
TripCard.displayName = 'TripCard';

const infiniteTrips = [...upcomingTrips, ...upcomingTrips, ...upcomingTrips];

// --- Main Component ---
export const HeroMain = memo(() => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const animationFrameRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);
    const cardWidth = 300;
    const navigate = useNavigate();
    const { user } = useAuth();

    // Smooth horizontal scroll logic
    const scroll = useCallback((direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    }, []);

    const handleInfiniteScroll = useCallback(() => {
        if (scrollRef.current) {
            const { scrollLeft } = scrollRef.current;
            const singleSetWidth = upcomingTrips.length * cardWidth;
            if (scrollLeft >= singleSetWidth * 2) {
                scrollRef.current.scrollLeft = scrollLeft - singleSetWidth;
            } else if (scrollLeft <= 0) {
                scrollRef.current.scrollLeft = singleSetWidth;
            }
        }
    }, []);

    const autoScroll = useCallback((timestamp: number) => {
        if (scrollRef.current && !isPaused) {
            if (timestamp - lastTimeRef.current >= 33) {
                scrollRef.current.scrollLeft += 1;
                handleInfiniteScroll();
                lastTimeRef.current = timestamp;
            }
        }
        animationFrameRef.current = requestAnimationFrame(autoScroll);
    }, [isPaused, handleInfiniteScroll]);

    // Initialize scroll position
    useEffect(() => {
        if (scrollRef.current) {
            const singleSetWidth = upcomingTrips.length * cardWidth;
            scrollRef.current.scrollLeft = singleSetWidth;
        }
    }, []);

    // Animation Loop
    useEffect(() => {
        if (!isPaused) animationFrameRef.current = requestAnimationFrame(autoScroll);
        else if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
    }, [isPaused, autoScroll]);

    const handleMouseEnter = useCallback(() => setIsPaused(true), []);
    const handleMouseLeave = useCallback(() => setIsPaused(false), []);

    const tripCards = useMemo(() => infiniteTrips.map((trip, index) => (
        <TripCard key={`${trip.id}-${index}`} trip={trip} index={index % upcomingTrips.length} />
    )), []);

    return (
        <section className="relative min-h-screen overflow-hidden flex items-center">
            {/* Background */}
            <div className="absolute inset-0">
                <img src={heroBg} alt="" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`} />
                <video
                    ref={videoRef} autoPlay muted loop playsInline preload="metadata"
                    onLoadedData={() => setVideoLoaded(true)}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                >
                    <source src={heroVideo} type="video/mp4" />
                </video>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/95 via-navy-deep/80 to-navy-deep/60" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 pt-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 h-full">

                    {/* LEFT SIDE: Modified Headline + Quiz Button Only */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-shrink-0 lg:max-w-xl text-left"
                    >
                        {/* Headline */}
                        <h1 className="font-jakarta text-4xl md:text-5xl xl:text-6xl font-extrabold text-foreground leading-[1.1] mb-6 relative">
                            {/* Floating particles (V1 Feature) */}
                            <div className="absolute -inset-4 pointer-events-none">
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1 h-1 bg-primary/30 rounded-full"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                        }}
                                        animate={{
                                            y: [0, -20, 0],
                                            opacity: [0.3, 0.8, 0.3],
                                            scale: [1, 1.5, 1],
                                        }}
                                        transition={{
                                            duration: 3 + Math.random() * 2,
                                            repeat: Infinity,
                                            delay: Math.random() * 2,
                                        }}
                                    />
                                ))}
                            </div>

                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="inline-block"
                            >
                                Your Trip.
                            </motion.span>
                            <br className="hidden md:block" />
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.8, type: "spring", stiffness: 200 }}
                                className="text-gradient inline-block relative ml-2 md:ml-0"
                            >
                                Your Style.
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 1.2 }}
                                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-full origin-left"
                                />
                            </motion.span>
                            <br />
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.0 }}
                                className="inline-block mt-4"
                            >
                                Travel Amigo
                            </motion.span>
                            {' '}
                            <motion.span
                                initial={{ opacity: 0, rotateX: -90 }}
                                animate={{ opacity: 1, rotateX: 0 }}
                                transition={{ duration: 0.6, delay: 1.2, type: "spring" }}
                                className="inline-block"
                            >
                                Makes It Easy
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 1.4, type: "spring", stiffness: 400 }}
                                className="text-primary inline-block"
                            >
                                .
                            </motion.span>
                        </h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.5 }}
                            className="text-lg md:text-xl text-muted-foreground font-sans mb-8 max-w-lg leading-relaxed"
                        >
                            Solo, couple, family, friends, or group — tell us how you like to travel.
                            Take our quick quiz and let Travel Amigo guide you to the perfect trip, planned the best way for you.
                        </motion.p>

                        {/* Action Component: EXACT Button from Redesign */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-wrap gap-4"
                        >
                            <MagneticButton
                                onClick={() => navigate('/start-quiz')}
                                className="group relative px-8 py-5 text-lg font-semibold bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 text-white rounded-2xl shadow-2xl shadow-primary/50 transition-all duration-300 hover:scale-105 animate-glow-pulse"
                            >
                                <span className="flex items-center gap-3">
                                    <span>👉 Take the Travel Quiz</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </MagneticButton>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT SIDE: Upcoming Trips Slider (Preserved V1) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex-1 w-full lg:w-auto lg:max-w-[55%] overflow-hidden"
                    >
                        <div className="flex items-start justify-between mb-6 gap-4 pr-6">
                            <div className="flex-1 min-w-0">
                                <h2 className="font-serif text-2xl font-bold text-foreground">Upcoming Trips</h2>
                                <p className="text-sm text-muted-foreground font-sans">Curated departures filling fast</p>
                            </div>
                            <div className="flex gap-3 flex-shrink-0">
                                <button onClick={() => scroll('left')} className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-primary bg-primary/20 hover:bg-primary/40 text-primary cursor-pointer hover:scale-105"><ChevronLeft className="w-5 h-5" /></button>
                                <button onClick={() => scroll('right')} className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-primary bg-primary/20 hover:bg-primary/40 text-primary cursor-pointer hover:scale-105"><ChevronRight className="w-5 h-5" /></button>
                            </div>
                        </div>

                        <div
                            ref={scrollRef}
                            onScroll={handleInfiniteScroll}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 pr-6"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {tripCards}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
});

HeroMain.displayName = 'HeroMain';
