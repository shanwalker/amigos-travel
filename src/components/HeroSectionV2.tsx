import { motion } from 'framer-motion';
import { MapPin, Calendar, Users } from 'lucide-react';
import heroVideo from '@/assets/hero-video.mp4';
import { MagneticButton, TypingText } from './ui/animations';

export const HeroSectionV2 = () => {
  const destinations = ['Vietnam', 'Thailand', 'Bali', 'Japan', 'Greece'];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden film-grain vignette">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/90 via-navy-deep/70 to-navy-deep/50" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 max-w-2xl"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-block px-4 py-2 rounded-full glass-card text-sm font-sans font-medium text-primary mb-6"
          >
            ✈️ Premium Group Travel Experiences
          </motion.span>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-[1.1] mb-6">
            Travel with
            <span className="text-gradient"> Friends</span>
            <br />
            You Haven't Met
            <span className="text-primary">.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-xl mb-8">
            Join curated group adventures with like-minded travelers. Fixed departures, 
            flexible plans, and lifetime memories—all with your new global family.
          </p>

          <div className="flex flex-wrap gap-4">
            <MagneticButton className="animate-glow-pulse">
              Explore Trips
            </MagneticButton>
            <button className="px-8 py-4 rounded-xl border border-foreground/20 text-foreground font-sans font-semibold hover:bg-foreground/5 transition-colors">
              Watch Story
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-12">
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

        {/* Right - Glassmorphism Card */}
        <motion.div
          initial={{ opacity: 0, x: 50, rotateY: -10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-md animate-float"
        >
          <div className="glass-card p-6 md:p-8">
            {/* Live Ticker */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-foreground/10">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-sm text-muted-foreground font-sans">
                Joining <span className="text-primary font-semibold">14 Amigos</span> in{' '}
                <TypingText texts={destinations} className="text-primary font-semibold" />
              </p>
            </div>

            <h3 className="text-xl font-serif font-bold text-foreground mb-6">
              Find Your Next Adventure
            </h3>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select className="w-full bg-navy-medium/50 border border-foreground/10 rounded-xl py-4 pl-12 pr-4 text-foreground font-sans appearance-none focus:outline-none focus:border-primary transition-colors">
                  <option>Where do you want to go?</option>
                  <option>Vietnam</option>
                  <option>Thailand</option>
                  <option>Bali</option>
                  <option>Japan</option>
                  <option>Greece</option>
                </select>
              </div>

              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="When?"
                  className="w-full bg-navy-medium/50 border border-foreground/10 rounded-xl py-4 pl-12 pr-4 text-foreground font-sans placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select className="w-full bg-navy-medium/50 border border-foreground/10 rounded-xl py-4 pl-12 pr-4 text-foreground font-sans appearance-none focus:outline-none focus:border-primary transition-colors">
                  <option>Trip Type</option>
                  <option>Fixed Group</option>
                  <option>Flexible / Vote</option>
                  <option>Family / Open Tribe</option>
                </select>
              </div>
            </div>

            {/* CTA */}
            <MagneticButton className="w-full mt-6 justify-center">
              Explore Trips
            </MagneticButton>

            {/* Trust Badge */}
            <p className="text-center text-xs text-muted-foreground mt-4 font-sans">
              ⭐ Rated <span className="font-display font-semibold">4.9/5</span> by <span className="font-display font-semibold">10,000+</span> travelers
            </p>
          </div>
        </motion.div>
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
