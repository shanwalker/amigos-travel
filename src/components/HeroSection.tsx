import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Users } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
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
  duration: string;
  price: string;
  image: string;
  departures: string;
  spots: number;
}

const upcomingTrips: Trip[] = [
  {
    id: 1,
    destination: 'Thailand Island Hopping',
    duration: '15 days',
    price: '₹89,999',
    image: tripThailand,
    departures: 'Jan 25, Feb 10',
    spots: 6,
  },
  {
    id: 2,
    destination: 'Vietnam Discovery',
    duration: '12 days',
    price: '₹74,999',
    image: tripVietnam,
    departures: 'Feb 5, Mar 1',
    spots: 4,
  },
  {
    id: 3,
    destination: 'Bali & Beyond',
    duration: '10 days',
    price: '₹69,999',
    image: tripBali,
    departures: 'Jan 28, Feb 15',
    spots: 8,
  },
  {
    id: 4,
    destination: 'Japan Spring',
    duration: '14 days',
    price: '₹1,29,999',
    image: tripJapan,
    departures: 'Mar 20, Apr 5',
    spots: 3,
  },
  {
    id: 5,
    destination: 'Sri Lanka Explorer',
    duration: '11 days',
    price: '₹64,999',
    image: tripThailand,
    departures: 'Feb 12, Mar 8',
    spots: 5,
  },
];

const TripCard = ({ trip, index }: { trip: Trip; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
      className="relative flex-shrink-0 w-[280px] h-[380px] rounded-2xl overflow-hidden group cursor-pointer"
    >
      {/* Background Image - with explicit dimensions for CLS */}
      <img 
        src={trip.image}
        alt={trip.destination}
        loading="lazy"
        decoding="async"
        width={280}
        height={380}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />
      
      {/* Spots Badge */}
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm">
        <span className="text-xs font-sans font-semibold text-primary-foreground">
          <span className="font-display">{trip.spots}</span> spots left
        </span>
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {/* Duration */}
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-sans text-foreground/80">
            <span className="font-display">{trip.duration.split(' ')[0]}</span> {trip.duration.split(' ')[1]}
          </span>
        </div>
        
        {/* Destination */}
        <h3 className="font-serif text-2xl font-bold text-foreground mb-3 leading-tight">
          {trip.destination}
        </h3>
        
        {/* Departures */}
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-sans text-muted-foreground">{trip.departures}</span>
        </div>
        
        {/* Price Button */}
        <div className="glass-card px-4 py-2.5 inline-flex items-center gap-2 group-hover:bg-primary/20 transition-colors">
          <span className="text-xs font-sans text-muted-foreground">from</span>
          <span className="text-lg font-display font-bold text-primary tracking-tight">{trip.price}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Duplicate trips for infinite scroll effect
const infiniteTrips = [...upcomingTrips, ...upcomingTrips, ...upcomingTrips];

export const HeroSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
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
      const { scrollLeft, scrollWidth } = scrollRef.current;
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

  // Auto-scroll logic
  const autoScroll = useCallback(() => {
    if (scrollRef.current && !isPaused) {
      scrollRef.current.scrollBy({ left: 1, behavior: 'auto' });
      handleInfiniteScroll();
    }
  }, [isPaused, handleInfiniteScroll]);

  // Initialize scroll position to middle set for seamless infinite scroll
  useEffect(() => {
    if (scrollRef.current) {
      const singleSetWidth = upcomingTrips.length * cardWidth;
      scrollRef.current.scrollLeft = singleSetWidth;
    }
  }, []);

  // Start/stop auto-scroll based on pause state
  useEffect(() => {
    if (!isPaused) {
      autoScrollRef.current = setInterval(autoScroll, 30);
    } else {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isPaused, autoScroll]);

  // Pause handlers
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => {
    // Resume after a short delay to allow for touch scrolling
    setTimeout(() => setIsPaused(false), 3000);
  };

  // Force video play on mount (handles browser autoplay restrictions)
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay was prevented, add click handler to start video
        const startVideo = () => {
          video.play();
          document.removeEventListener('click', startVideo);
          document.removeEventListener('touchstart', startVideo);
        };
        document.addEventListener('click', startVideo);
        document.addEventListener('touchstart', startVideo);
      });
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden film-grain vignette">
      {/* Background - Placeholder Image + Video */}
      <div className="absolute inset-0">
        {/* Placeholder Image - shows instantly */}
        <img
          src={heroBg}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Video - fades in when loaded */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
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
              {[
                { value: '10K+', label: 'Amigos' },
                { value: '50+', label: 'Countries' },
                { value: '4.9', label: 'Rating' },
              ].map((stat, i) => (
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
                  className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-primary bg-primary/20 hover:bg-primary/40 text-primary cursor-pointer hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  aria-label="Next trips"
                  className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-primary bg-primary/20 hover:bg-primary/40 text-primary cursor-pointer hover:scale-105"
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
              {infiniteTrips.map((trip, index) => (
                <TripCard key={`${trip.id}-${index}`} trip={trip} index={index % upcomingTrips.length} />
              ))}
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
};
