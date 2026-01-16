import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Users } from 'lucide-react';
import { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';
import heroVideo from '@/assets/hero-video.mp4';
import tripThailand from '@/assets/trip-thailand.jpg';
import heroBg from '@/assets/hero-bg.jpg';
import tripVietnam from '@/assets/trip-vietnam.jpg';
import tripBali from '@/assets/trip-bali.jpg';
import tripJapan from '@/assets/trip-japan.jpg';
import { MagneticButton } from './ui/animations';

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

// Memoized TripCard for performance
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
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      {/* Spots Badge */}
      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full glass-card text-sm font-sans font-semibold text-primary">
        {trip.spotsLeft} spots left
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-serif text-xl font-bold text-white mb-2">{trip.destination}</h3>
        
        <div className="flex items-center gap-4 text-white/80 text-sm font-sans mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{trip.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>12 travelers</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-white/60 font-sans">Starting from</span>
            <div className="text-xl font-display font-bold text-primary">{trip.price}</div>
          </div>
          <button 
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-sans font-medium text-sm 
                       opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 
                       transition-all duration-300 will-change-[opacity,transform]"
          >
            View Trip
          </button>
        </div>
      </div>
    </motion.div>
  );
});

TripCard.displayName = 'TripCard';

// Duplicate trips for infinite scroll effect - memoized
const infiniteTrips = [...upcomingTrips, ...upcomingTrips, ...upcomingTrips];

// Memoized stats for performance
const stats = [
  { value: '10K+', label: 'Amigos' },
  { value: '50+', label: 'Countries' },
  { value: '4.9', label: 'Rating' },
];

export const HeroSection = memo(() => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const cardWidth = 300; // 280px card + 20px gap

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  // Infinite scroll logic - seamlessly loop
  const handleInfiniteScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const singleSetWidth = upcomingTrips.length * cardWidth;
      
      // If scrolled past the second set, jump back to first set
      if (scrollLeft >= singleSetWidth * 2) {
        scrollRef.current.scrollLeft = scrollLeft - singleSetWidth;
      }
      // If scrolled before the first set, jump to second set
      else if (scrollLeft <= 0) {
        scrollRef.current.scrollLeft = singleSetWidth;
      }
    }
  }, []);

  // Auto-scroll using requestAnimationFrame for smooth 60fps animation
  const autoScroll = useCallback((timestamp: number) => {
    if (scrollRef.current && !isPaused) {
      // Throttle to ~30fps for battery efficiency while still smooth
      if (timestamp - lastTimeRef.current >= 33) {
        scrollRef.current.scrollLeft += 1;
        handleInfiniteScroll();
        lastTimeRef.current = timestamp;
      }
    }
    animationFrameRef.current = requestAnimationFrame(autoScroll);
  }, [isPaused, handleInfiniteScroll]);

  // Initialize scroll position to middle set for seamless infinite scroll
  useEffect(() => {
    if (scrollRef.current) {
      const singleSetWidth = upcomingTrips.length * cardWidth;
      scrollRef.current.scrollLeft = singleSetWidth;
    }
  }, []);

  // Start/stop auto-scroll based on pause state using RAF
  useEffect(() => {
    if (!isPaused) {
      animationFrameRef.current = requestAnimationFrame(autoScroll);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, autoScroll]);

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);
  const handleTouchStart = useCallback(() => setIsPaused(true), []);
  const handleTouchEnd = useCallback(() => setIsPaused(false), []);

  // Start video playback with better performance
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Use Intersection Observer to only load video when in view
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay was prevented, add click handler to start video
              const startVideo = () => {
                video.play();
                document.removeEventListener('click', startVideo);
                document.removeEventListener('touchstart', startVideo);
              };
              document.addEventListener('click', startVideo, { passive: true });
              document.addEventListener('touchstart', startVideo, { passive: true });
            });
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(video);
      return () => observer.disconnect();
    }
  }, []);

  // Memoized trip cards
  const tripCards = useMemo(() => 
    infiniteTrips.map((trip, index) => (
      <TripCard key={`${trip.id}-${index}`} trip={trip} index={index % upcomingTrips.length} />
    )),
  []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Test Site Banner */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-center pt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="px-6 py-3 rounded-full glass-card border-2 border-primary/50 backdrop-blur-xl"
        >
          <span className="text-sm md:text-base font-sans font-semibold text-primary flex items-center gap-2">
            🧪 Test Site - Demo Version
          </span>
        </motion.div>
      </div>

      {/* Background - Placeholder Image + Video */}
      <div className="absolute inset-0">
        {/* Placeholder Image - shows instantly */}
        <img
          src={heroBg}
          alt=""
          loading="eager"
          fetchPriority="high"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Video - fades in when loaded, uses metadata preload for faster start */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 will-change-opacity ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          // @ts-ignore - webkit-playsinline for iOS Safari
          webkit-playsinline="true"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/95 via-navy-deep/80 to-navy-deep/60" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          {/* Left Content - Headline */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-shrink-0 lg:max-w-lg"
          >
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-block px-4 py-2 rounded-full glass-card text-sm font-sans font-medium text-primary mb-6"
            >
              ✈️ Premium Group Travel
            </motion.span>
            
            <h1 className="font-serif text-5xl md:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] mb-6">
              Travel with
              <span className="text-gradient"> Friends</span>
              <br />
              You Haven't Met
              <span className="text-primary">.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground font-sans max-w-md mb-8">
              Join curated group adventures with like-minded travelers. Fixed departures, 
              flexible plans, and lifetime memories.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <MagneticButton className="animate-glow-pulse">
                View All Trips
              </MagneticButton>
              <button className="px-6 py-4 rounded-xl border border-foreground/20 text-foreground font-sans font-semibold hover:bg-foreground/5 transition-colors">
                Watch Story
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-10">
              {stats.map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-sans uppercase tracking-wider mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Upcoming Trips Slider */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 w-full lg:w-auto lg:max-w-[55%] overflow-hidden"
          >
            {/* Section Header with Navigation */}
            <div className="flex items-start justify-between mb-6 gap-4 pr-6">
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-2xl font-bold text-foreground">Upcoming Trips</h2>
                <p className="text-sm text-muted-foreground font-sans">Curated departures filling fast</p>
              </div>
              
              {/* Navigation Arrows */}
              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={() => scroll('left')}
                  aria-label="Previous trips"
                  className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-primary bg-primary/20 hover:bg-primary/40 text-primary cursor-pointer hover:scale-105 will-change-transform"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  aria-label="Next trips"
                  className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-primary bg-primary/20 hover:bg-primary/40 text-primary cursor-pointer hover:scale-105 will-change-transform"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Trip Cards Slider - Infinite */}
            <div
              ref={scrollRef}
              onScroll={handleInfiniteScroll}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 pr-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {tripCards}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground font-sans">Scroll to explore</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-foreground/30 flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
