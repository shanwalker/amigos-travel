import { motion } from 'framer-motion';
import { MapPin, Calendar, Users } from 'lucide-react';
import { MagneticButton, TypingText } from './ui/animations';

export const HeroSectionV2 = () => {
  const destinations = ['Vietnam', 'Thailand', 'Bali', 'Japan', 'Greece'];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-superlist-dark film-grain">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-amigo-orange/10 via-transparent to-transparent blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-purple-500/10 via-transparent to-transparent blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full glass-card text-sm font-sans font-medium text-primary mb-6"
          >
            ✈️ Premium Group Travel Experiences
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-luxury text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[1.05] mb-6 tracking-tight"
          >
            Travel with{' '}
            <span className="italic text-primary">Friends</span>
            <br />
            You Haven't Met
            <span className="text-primary">.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto mb-8"
          >
            Join curated group adventures with like-minded travelers. Fixed departures, 
            flexible plans, and lifetime memories—all with your new global family.
          </motion.p>

          {/* Typing Text for destinations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-10"
          >
            <span className="text-muted-foreground font-sans">Next destination: </span>
            <TypingText 
              texts={destinations} 
              className="text-primary font-semibold font-sans"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <MagneticButton className="animate-glow-pulse">
              Explore Trips
            </MagneticButton>
            <button className="px-8 py-4 rounded-xl border border-foreground/20 text-foreground font-sans font-semibold hover:bg-foreground/5 transition-colors">
              Watch Story
            </button>
          </motion.div>

          {/* Floating Booking Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <div className="glass-card p-6 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/30">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Destination</p>
                    <p className="text-foreground font-medium">Thailand</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/30">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Departure</p>
                    <p className="text-foreground font-medium">Jan 28, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/30">
                  <Users className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Group Size</p>
                    <p className="text-foreground font-medium">12 Amigos</p>
                  </div>
                </div>
                <MagneticButton className="w-full">
                  Book Now
                </MagneticButton>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="flex justify-center gap-10 mt-12">
            {[
              { value: '10K+', label: 'Amigos' },
              { value: '50+', label: 'Countries' },
              { value: '4.9', label: 'Rating' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.1 }}
                className="text-center group"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight transition-colors group-hover:text-primary"
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs text-muted-foreground font-sans uppercase tracking-wider mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
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
