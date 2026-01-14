import { motion, useMotionValue, useSpring } from 'framer-motion';
import { MapPin, Calendar, Users } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { MagneticButton, TypingText } from './ui/animations';
import { FloatingPhone } from './ui/floating-phone';
import { TextReveal, GlowingText } from './ui/text-reveal';

export const HeroSectionV2 = () => {
  const destinations = ['Vietnam', 'Thailand', 'Bali', 'Japan', 'Greece'];
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Custom cursor motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring physics for smooth cursor
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  // Trail dots with different delays
  const trail1X = useSpring(cursorX, { damping: 30, stiffness: 100, mass: 0.8 });
  const trail1Y = useSpring(cursorY, { damping: 30, stiffness: 100, mass: 0.8 });
  const trail2X = useSpring(cursorX, { damping: 35, stiffness: 80, mass: 1 });
  const trail2Y = useSpring(cursorY, { damping: 35, stiffness: 80, mass: 1 });
  const trail3X = useSpring(cursorX, { damping: 40, stiffness: 60, mass: 1.2 });
  const trail3Y = useSpring(cursorY, { damping: 40, stiffness: 60, mass: 1.2 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-superlist-dark film-grain cursor-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Custom Cursor with Trail */}
      <motion.div
        className="pointer-events-none fixed z-50 mix-blend-screen hidden lg:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 1 : 0,
            opacity: isHovering ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Outer glow ring */}
          <div className="absolute -inset-12 rounded-full bg-gradient-radial from-amigo-orange/40 via-amigo-orange/10 to-transparent blur-2xl" />
          
          {/* Pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-4 rounded-full border border-amigo-orange/30"
          />
          
          {/* Main cursor dot */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-5 rounded-full bg-gradient-to-br from-amigo-orange to-amigo-glow shadow-[0_0_30px_rgba(255,180,0,0.8)]"
          />
        </motion.div>
      </motion.div>

      {/* Trail dot 1 */}
      <motion.div
        className="pointer-events-none fixed z-40 hidden lg:block"
        style={{
          x: trail1X,
          y: trail1Y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{ opacity: isHovering ? 0.7 : 0 }}
          className="w-3 h-3 rounded-full bg-amigo-orange/70 shadow-[0_0_10px_rgba(255,180,0,0.5)]"
        />
      </motion.div>

      {/* Trail dot 2 */}
      <motion.div
        className="pointer-events-none fixed z-40 hidden lg:block"
        style={{
          x: trail2X,
          y: trail2Y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{ opacity: isHovering ? 0.5 : 0 }}
          className="w-2 h-2 rounded-full bg-amigo-orange/50"
        />
      </motion.div>

      {/* Trail dot 3 */}
      <motion.div
        className="pointer-events-none fixed z-40 hidden lg:block"
        style={{
          x: trail3X,
          y: trail3Y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{ opacity: isHovering ? 0.3 : 0 }}
          className="w-1.5 h-1.5 rounded-full bg-amigo-orange/30"
        />
      </motion.div>

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
      <div className="relative z-10 container mx-auto px-6 py-32 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
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
          
          <h1 className="font-luxury text-5xl md:text-7xl font-bold text-foreground leading-[1.05] mb-6 tracking-tight">
            <TextReveal text="Travel with" delay={0.3} className="block" />
            <span className="block">
              <GlowingText className="italic text-6xl md:text-8xl">Friends</GlowingText>
            </span>
            <TextReveal text="You Haven't Met" delay={0.6} className="block" />
            <motion.span 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: 'spring' }}
              className="text-primary"
            >.</motion.span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground font-sans max-w-xl mb-8"
          >
            Join curated group adventures with like-minded travelers. Fixed departures, 
            flexible plans, and lifetime memories—all with your new global family.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-wrap gap-4"
          >
            <MagneticButton className="animate-glow-pulse cursor-none">
              Explore Trips
            </MagneticButton>
            <button className="px-8 py-4 rounded-xl border border-foreground/20 text-foreground font-sans font-semibold hover:bg-foreground/5 transition-colors cursor-none">
              Watch Story
            </button>
          </motion.div>

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
        </motion.div>

        {/* Right - Floating Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, type: 'spring', damping: 20 }}
          className="w-full max-w-md flex items-center justify-center"
        >
          <FloatingPhone className="transform hover:scale-105 transition-transform duration-500" />
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
