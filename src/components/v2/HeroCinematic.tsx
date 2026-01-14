import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, Calendar, Users, Sparkles } from 'lucide-react';
import { MagneticButton, TypingText } from '../ui/animations';
import { TextReveal } from './TextReveal';
import heroVideo from '@/assets/hero-video.mp4';
import heroBg from '@/assets/hero-bg.jpg';
import logo from '@/assets/logo.png';

export const HeroCinematic = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [amigoCount, setAmigoCount] = useState(14);
  const destinations = ['Thailand', 'Bali', 'Vietnam', 'Japan', 'Greece'];
  const [currentDestination, setCurrentDestination] = useState(0);

  // Mouse tracking for parallax orbs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 50, stiffness: 100 };
  const orbX1 = useSpring(useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [40, -40]), springConfig);
  const orbY1 = useSpring(useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [40, -40]), springConfig);
  const orbX2 = useSpring(useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-30, 30]), springConfig);
  const orbY2 = useSpring(useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-30, 30]), springConfig);
  const orbX3 = useSpring(useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [20, -20]), springConfig);
  const orbY3 = useSpring(useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [20, -20]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDestination((prev) => (prev + 1) % destinations.length);
      setAmigoCount(Math.floor(Math.random() * 10) + 10);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden v2-hero-gradient film-grain vignette">
      {/* Parallax Gradient Orbs */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none z-[1]"
        style={{ 
          x: orbX1, 
          y: orbY1,
          top: '10%',
          left: '10%',
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <motion.div 
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none z-[1]"
        style={{ 
          x: orbX2, 
          y: orbY2,
          bottom: '20%',
          right: '5%',
          background: 'radial-gradient(circle, hsl(270 70% 50% / 0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <motion.div 
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none z-[1]"
        style={{ 
          x: orbX3, 
          y: orbY3,
          top: '50%',
          left: '50%',
          background: 'radial-gradient(circle, hsl(200 70% 50% / 0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Background Video with placeholder */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg}
          alt="Travel background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-0' : 'opacity-40'}`}
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-40' : 'opacity-0'}`}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy-deep/40 to-navy-deep/90" />
      </div>

      {/* Live Status Ticker */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-24 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="glass-card px-6 py-3 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="font-sans text-sm text-foreground/90">
            Joining <span className="font-bold text-primary">{amigoCount} Amigos</span> in{' '}
            <motion.span 
              key={currentDestination}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-bold text-primary"
            >
              {destinations[currentDestination]}
            </motion.span>...
          </span>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-6"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-jakarta text-sm font-semibold text-primary uppercase tracking-wider">
                Premium Group Travel
              </span>
            </motion.div>

            <h1 className="font-jakarta text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] mb-6">
              <TextReveal delay={0.3}>Travel with Friends</TextReveal>
              <br />
              <TextReveal delay={0.5}>You Haven't Met</TextReveal>
              <span className="text-primary">.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-xl mb-8 leading-relaxed">
              Join curated group adventures with like-minded travelers. Fixed departures, 
              flexible plans, and lifetime memories—all with your new global family.
            </p>

            <div className="mb-8">
              <span className="text-muted-foreground font-sans">Next adventure: </span>
              <TypingText 
                texts={destinations}
                className="text-primary font-semibold font-jakarta text-lg"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <MagneticButton className="animate-glow-pulse">
                Explore Now
              </MagneticButton>
              <button className="px-8 py-4 rounded-xl border border-foreground/20 text-foreground font-jakarta font-semibold hover:bg-foreground/5 transition-colors flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                Watch Story
              </button>
            </div>
          </motion.div>

          {/* Right: Glassmorphism Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
              {/* Card glow effect */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <img src={logo} alt="Travel Amigo" className="w-10 h-10 object-contain" />
                  <div>
                    <h3 className="font-jakarta font-bold text-foreground">Next Departure</h3>
                    <p className="text-sm text-muted-foreground">Thailand Adventure</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-background/20 border border-foreground/10">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Destination</p>
                      <p className="text-foreground font-jakarta font-semibold">Phuket → Bangkok → Chiang Mai</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-background/20 border border-foreground/10">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Departure</p>
                        <p className="text-foreground font-semibold">Jan 28</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-background/20 border border-foreground/10">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Group</p>
                        <p className="text-foreground font-semibold">12 Amigos</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Spots filled</span>
                    <span className="text-primary font-semibold">12/20</span>
                  </div>
                  <div className="h-2 rounded-full bg-background/30 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '60%' }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      className="h-full liquid-progress rounded-full"
                    />
                  </div>
                </div>

                <MagneticButton className="w-full justify-center">
                  Reserve Your Spot
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="glass-card px-8 py-4 flex gap-10">
          {[
            { value: '10K+', label: 'Amigos' },
            { value: '50+', label: 'Countries' },
            { value: '4.9', label: 'Rating' },
            { value: '200+', label: 'Trips' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
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
