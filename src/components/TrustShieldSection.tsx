import { motion } from 'framer-motion';
import { Headphones, ShieldCheck, Umbrella, Users, Star, Award, Globe, Lock } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface TrustPillar {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat?: string;
}

const trustPillars: TrustPillar[] = [
  {
    icon: <Headphones className="w-8 h-8" />,
    title: '24/7 Trip Support',
    description: 'Our team is always just a message away, no matter the timezone.',
    stat: '< 5 min response',
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: 'Verified Local Hosts',
    description: 'Every host undergoes thorough background checks and training.',
    stat: '100% verified',
  },
  {
    icon: <Umbrella className="w-8 h-8" />,
    title: 'Travel Insurance',
    description: 'Comprehensive coverage included with every booking.',
    stat: 'Fully covered',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Women-Safe Groups',
    description: 'Optional women-only groups for added comfort and safety.',
    stat: '500+ safe trips',
  },
];

const partnerLogos = [
  { name: 'TripAdvisor', icon: <Star className="w-5 h-5" /> },
  { name: 'Certified', icon: <Award className="w-5 h-5" /> },
  { name: 'Global', icon: <Globe className="w-5 h-5" /> },
  { name: 'Secure', icon: <Lock className="w-5 h-5" /> },
];

const AnimatedCounter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentRef = ref.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          
          timerRef.current = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              if (timerRef.current) clearInterval(timerRef.current);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (currentRef) observer.observe(currentRef);
    
    return () => {
      observer.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [target]);

  return (
    <span ref={ref} className="font-mono text-5xl md:text-6xl font-bold text-amigo-orange">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export const TrustShieldSection = () => {
  return (
    <section className="py-16 md:py-20 bg-navy relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Glowing Shield Background */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-amigo-orange/20 to-transparent blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <ShieldCheck className="w-10 h-10 text-amigo-orange" />
          </motion.div>
          <span className="text-amigo-orange font-medium text-sm tracking-wider uppercase mb-4 block">
            Your Safety, Our Priority
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Travel with <span className="text-amigo-orange">Confidence</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every adventure is backed by our comprehensive safety network and 24/7 support.
          </p>
        </motion.div>

        {/* Counter Stat */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="glass-card inline-block px-12 py-8 rounded-2xl">
            <AnimatedCounter target={10000} suffix="+" />
            <p className="text-muted-foreground mt-2">Safe Adventures Completed</p>
          </div>
        </motion.div>

        {/* Trust Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustPillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              className="glass-card p-6 rounded-2xl text-center group hover:border-amigo-orange/50 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-amigo-orange/10 flex items-center justify-center text-amigo-orange group-hover:bg-amigo-orange group-hover:text-navy transition-colors"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {pillar.icon}
              </motion.div>
              <h3 className="font-semibold text-foreground text-lg mb-2">{pillar.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{pillar.description}</p>
              {pillar.stat && (
                <span className="inline-block px-3 py-1 bg-amigo-orange/20 text-amigo-orange text-xs font-medium rounded-full">
                  {pillar.stat}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Partner Logos */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-muted-foreground text-sm">Trusted by:</span>
          {partnerLogos.map((partner, index) => (
            <motion.div
              key={partner.name}
              className="flex items-center gap-2 text-muted-foreground/60 hover:text-amigo-orange transition-colors"
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {partner.icon}
              <span className="text-sm font-medium">{partner.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
