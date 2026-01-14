import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Clock, Zap } from 'lucide-react';
import tripBali from '@/assets/trip-bali.jpg';
import tripJapan from '@/assets/trip-japan.jpg';
import tripThailand from '@/assets/trip-thailand.jpg';
import tripVietnam from '@/assets/trip-vietnam.jpg';

interface Trip {
  id: number;
  title: string;
  location: string;
  date: string;
  spots: number;
  totalSpots: number;
  price: string;
  image: string;
  isFixed: boolean;
  size: 'large' | 'medium' | 'small';
}

const trips: Trip[] = [
  {
    id: 1,
    title: "Bali Soul Reset",
    location: "Bali, Indonesia",
    date: "Feb 14-22",
    spots: 4,
    totalSpots: 15,
    price: "₹89,999",
    image: tripBali,
    isFixed: true,
    size: 'large',
  },
  {
    id: 2,
    title: "Japan Cherry Blossom",
    location: "Tokyo → Kyoto",
    date: "Mar 25 - Apr 5",
    spots: 8,
    totalSpots: 20,
    price: "₹1,49,999",
    image: tripJapan,
    isFixed: false,
    size: 'medium',
  },
  {
    id: 3,
    title: "Thailand Full Moon",
    location: "Phuket → Bangkok",
    date: "Jan 28 - Feb 5",
    spots: 2,
    totalSpots: 12,
    price: "₹54,999",
    image: tripThailand,
    isFixed: true,
    size: 'medium',
  },
  {
    id: 4,
    title: "Vietnam Discovery",
    location: "Hanoi → Ho Chi Minh",
    date: "Apr 10-20",
    spots: 10,
    totalSpots: 18,
    price: "₹74,999",
    image: tripVietnam,
    isFixed: false,
    size: 'small',
  },
];

const TripCard = ({ trip, index }: { trip: Trip; index: number }) => {
  const spotsPercentage = ((trip.totalSpots - trip.spots) / trip.totalSpots) * 100;
  
  const getSizeClasses = () => {
    switch (trip.size) {
      case 'large': return 'col-span-2 row-span-2';
      case 'medium': return 'col-span-1 row-span-2';
      case 'small': return 'col-span-1 row-span-1';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`${getSizeClasses()} relative rounded-3xl overflow-hidden glossy-sheen group cursor-pointer`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={trip.image} 
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/50 to-transparent" />
      </div>

      {/* Badge */}
      {trip.isFixed ? (
        <div className="absolute top-4 left-4 flex items-center gap-2 glass-card px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-xs font-jakarta font-semibold text-foreground">Fixed</span>
        </div>
      ) : (
        <div className="absolute top-4 left-4 flex items-center gap-2 glass-card px-3 py-1.5 rounded-full">
          <Zap className="w-3 h-3 text-primary" />
          <span className="text-xs font-jakarta font-semibold text-foreground">Flexible</span>
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className={`font-jakarta font-bold text-foreground mb-2 ${trip.size === 'large' ? 'text-2xl' : 'text-lg'}`}>
          {trip.title}
        </h3>
        
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{trip.location}</span>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{trip.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">{trip.spots} spots</span>
          </div>
        </div>

        {/* Progress Ring / Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-muted-foreground">Filling fast</span>
            <span className="text-xs font-semibold text-primary">{Math.round(spotsPercentage)}% filled</span>
          </div>
          <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${spotsPercentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className={`h-full rounded-full ${trip.isFixed ? 'bg-red-500' : 'liquid-progress'}`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Starting from</span>
            <p className="font-display text-xl font-bold text-foreground">{trip.price}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-jakarta font-semibold text-sm"
          >
            View Trip
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export const FlashPackBentoGrid = () => {
  return (
    <section className="py-20 bg-navy-deep">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-jakarta font-semibold text-sm uppercase tracking-wider">
            Curated Experiences
          </span>
          <h2 className="font-jakarta text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Choose Your Adventure
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hand-picked destinations with verified hosts. Fixed departures for the spontaneous, 
            flexible trips for the planners.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
          {trips.map((trip, index) => (
            <TripCard key={trip.id} trip={trip} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="px-8 py-4 rounded-xl border border-foreground/20 text-foreground font-jakarta font-semibold hover:bg-foreground/5 transition-colors">
            View All Trips
          </button>
        </motion.div>
      </div>
    </section>
  );
};
