import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MapPin, Users, Clock } from 'lucide-react';
import { useUpcomingTrip } from '@/hooks/useTrips';
import tripThailand from '@/assets/trip-thailand.jpg';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const FlipCard = ({ value, label }: { value: number; label: string }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setPrevValue(value);
        setIsFlipping(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-20 md:w-20 md:h-24">
        {/* Card Container */}
        <div className="absolute inset-0 bg-navy/90 rounded-lg border border-amigo-orange/30 overflow-hidden">
          {/* Top Half */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-navy to-navy/80 flex items-end justify-center overflow-hidden">
            <motion.span 
              className="font-mono text-3xl md:text-4xl font-bold text-amigo-orange translate-y-1/2"
              animate={isFlipping ? { rotateX: -90 } : { rotateX: 0 }}
              transition={{ duration: 0.15 }}
            >
              {String(value).padStart(2, '0')}
            </motion.span>
          </div>
          
          {/* Divider Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-navy/50 z-10" />
          
          {/* Bottom Half */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-navy to-navy/80 flex items-start justify-center overflow-hidden">
            <motion.span 
              className="font-mono text-3xl md:text-4xl font-bold text-amigo-orange -translate-y-1/2"
              animate={isFlipping ? { rotateX: 90 } : { rotateX: 0 }}
              transition={{ duration: 0.15, delay: 0.15 }}
            >
              {String(value).padStart(2, '0')}
            </motion.span>
          </div>
        </div>
        
        {/* Glow Effect */}
        <motion.div
          className="absolute -inset-2 bg-amigo-orange/20 rounded-xl blur-xl -z-10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <span className="text-muted-foreground text-xs md:text-sm mt-2 uppercase tracking-wider">{label}</span>
    </div>
  );
};

export const CountdownBannerSection = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { data: trip, isLoading } = useUpcomingTrip();

  useEffect(() => {
    // Use trip start_date if available, otherwise 12 days from now
    const targetDate = trip?.start_date 
      ? new Date(trip.start_date)
      : new Date(Date.now() + 12 * 24 * 60 * 60 * 1000);
    targetDate.setHours(10, 0, 0, 0);

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [trip?.start_date]);

  // Fallback values when loading or no data
  const tripTitle = trip?.title || 'Thailand Adventure';
  const tripDestination = trip?.destination || 'Bangkok → Phuket';
  const spotsLeft = trip?.spots_left ?? 3;
  const price = trip?.price ? `₹${trip.price.toLocaleString()}` : '₹45,999';
  const imageUrl = trip?.image_url || tripThailand;

  return (
    <section className="py-10 md:py-12 bg-gradient-to-r from-navy via-navy/95 to-navy relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${typeof imageUrl === 'string' && imageUrl.startsWith('/') ? imageUrl : tripThailand})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy" />

      {/* Pulsing Border */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amigo-orange to-transparent"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amigo-orange to-transparent"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left - Trip Info */}
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Trip Image */}
            <div className="relative hidden md:block">
              <div className="w-24 h-24 rounded-xl overflow-hidden">
                <img 
                  src={typeof imageUrl === 'string' && imageUrl.startsWith('/') ? imageUrl : tripThailand} 
                  alt={tripTitle} 
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                HOT
              </motion.div>
            </div>

            <div>
              <span className="text-amigo-orange text-sm font-medium flex items-center gap-1">
                <Clock className="w-4 h-4" /> Next Departure
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-foreground mt-1">
                {tripTitle}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {tripDestination}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> 
                  <span className="text-amigo-orange font-semibold">Only {spotsLeft} spots left!</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Center - Countdown */}
          <motion.div
            className="flex items-center gap-3 md:gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <FlipCard value={timeLeft.days} label="Days" />
            <span className="text-amigo-orange text-2xl font-bold mt-[-20px]">:</span>
            <FlipCard value={timeLeft.hours} label="Hours" />
            <span className="text-amigo-orange text-2xl font-bold mt-[-20px]">:</span>
            <FlipCard value={timeLeft.minutes} label="Mins" />
            <span className="text-amigo-orange text-2xl font-bold mt-[-20px]">:</span>
            <FlipCard value={timeLeft.seconds} label="Secs" />
          </motion.div>

          {/* Right - CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="magnetic-btn px-8 py-4 bg-amigo-orange text-navy font-bold rounded-full flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
            <p className="text-muted-foreground text-xs mt-2 text-center">
              Starting from <span className="text-amigo-orange font-semibold">{price}</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
