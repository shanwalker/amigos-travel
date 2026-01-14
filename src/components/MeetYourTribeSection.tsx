import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Camera, Utensils, Mountain, Music, Sparkles } from 'lucide-react';

interface Traveler {
  initials: string;
  name: string;
  location: string;
  interests: string[];
  avatar?: string;
  tripDestination: string;
}

const travelers: Traveler[] = [
  { initials: 'SK', name: 'Sneha K.', location: 'Mumbai', interests: ['Photography', 'Foodie'], tripDestination: 'Thailand' },
  { initials: 'AR', name: 'Arjun R.', location: 'Bangalore', interests: ['Adventure', 'Night Owl'], tripDestination: 'Thailand' },
  { initials: 'PM', name: 'Priya M.', location: 'Delhi', interests: ['Culture', 'Art'], tripDestination: 'Thailand' },
  { initials: 'VK', name: 'Vikram K.', location: 'Chennai', interests: ['Music', 'Foodie'], tripDestination: 'Vietnam' },
  { initials: 'NP', name: 'Neha P.', location: 'Pune', interests: ['Photography', 'Adventure'], tripDestination: 'Vietnam' },
  { initials: 'RS', name: 'Rahul S.', location: 'Hyderabad', interests: ['Night Owl', 'Culture'], tripDestination: 'Bali' },
];

const interestIcons: Record<string, React.ReactNode> = {
  'Photography': <Camera className="w-3 h-3" />,
  'Foodie': <Utensils className="w-3 h-3" />,
  'Adventure': <Mountain className="w-3 h-3" />,
  'Night Owl': <Music className="w-3 h-3" />,
  'Culture': <Sparkles className="w-3 h-3" />,
  'Art': <Sparkles className="w-3 h-3" />,
  'Music': <Music className="w-3 h-3" />,
};

const TravelerCard = ({ traveler, index }: { traveler: Traveler; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
    >
      <motion.div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.1, zIndex: 10 }}
      >
        {/* Avatar Circle */}
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-amigo-orange to-amber-600 flex items-center justify-center text-navy font-bold text-sm md:text-base shadow-lg ring-2 ring-background">
          {traveler.initials}
        </div>
        
        {/* Hover Card */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            y: isHovered ? 0 : 10,
            scale: isHovered ? 1 : 0.9
          }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 glass-card p-3 rounded-xl pointer-events-none z-20"
        >
          <p className="font-semibold text-foreground text-sm">{traveler.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" /> {traveler.location}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {traveler.interests.map((interest) => (
              <span 
                key={interest}
                className="text-[10px] bg-amigo-orange/20 text-amigo-orange px-2 py-0.5 rounded-full flex items-center gap-1"
              >
                {interestIcons[interest]} {interest}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-amigo-orange mt-2 font-medium">
            → Joining {traveler.tripDestination} trip
          </p>
          
          {/* Arrow */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-navy/80 rotate-45 backdrop-blur-xl" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const TribeGroup = ({ destination, count }: { destination: string; count: number }) => (
  <motion.div
    className="glass-card px-4 py-3 rounded-xl flex items-center gap-3"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex -space-x-2">
      {travelers
        .filter(t => t.tripDestination === destination)
        .slice(0, 3)
        .map((t, i) => (
          <div 
            key={i}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-amigo-orange to-amber-600 flex items-center justify-center text-navy text-xs font-bold ring-2 ring-background"
          >
            {t.initials}
          </div>
        ))}
    </div>
    <div>
      <p className="text-sm font-medium text-foreground">{destination}</p>
      <p className="text-xs text-muted-foreground">{count} travelers ready</p>
    </div>
  </motion.div>
);

export const MeetYourTribeSection = () => {
  return (
    <section className="py-16 md:py-20 bg-background relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-transparent to-navy/50" />
      
      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-amigo-orange/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-amigo-orange font-medium text-sm tracking-wider uppercase mb-4 block">
            Your Future Friends
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Meet Your Tribe
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            These adventurers are already packed and ready. Will you join them?
          </p>
        </motion.div>

        {/* Avatar Stack - Main Display */}
        <div className="flex justify-center mb-12">
          <div className="flex -space-x-3 md:-space-x-4">
            {travelers.map((traveler, index) => (
              <TravelerCard key={traveler.initials} traveler={traveler} index={index} />
            ))}
            <motion.div
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-navy/80 border-2 border-dashed border-amigo-orange/50 flex items-center justify-center text-amigo-orange text-xl font-bold"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.1, borderStyle: 'solid' }}
            >
              +
            </motion.div>
          </div>
        </div>

        {/* Social Proof Banner */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-foreground font-medium">
              <span className="text-amigo-orange font-bold">23 travelers</span> from your city are joining this month
            </span>
          </div>
        </motion.div>

        {/* Tribe Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <TribeGroup destination="Thailand" count={12} />
          <TribeGroup destination="Vietnam" count={8} />
          <TribeGroup destination="Bali" count={15} />
        </div>

        {/* Interest Tags */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {['Photography Lovers', 'Foodies', 'Adventure Seekers', 'Night Owls', 'Culture Buffs'].map((tag, i) => (
            <motion.span
              key={tag}
              className="px-4 py-2 rounded-full border border-muted-foreground/30 text-muted-foreground text-sm hover:border-amigo-orange hover:text-amigo-orange transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
