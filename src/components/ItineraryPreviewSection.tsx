import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Plane, Sun, Utensils, Camera, Heart } from 'lucide-react';
import tripThailand from '@/assets/trip-thailand.jpg';
import tripBali from '@/assets/trip-bali.jpg';
import tripVietnam from '@/assets/trip-vietnam.jpg';

interface DayItem {
  day: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  gradient: string;
}

const itinerary: DayItem[] = [
  {
    day: 1,
    title: 'Arrival in Bangkok',
    description: 'Touch down and meet your tribe. Evening rooftop welcome dinner with skyline views.',
    icon: <Plane className="w-5 h-5" />,
    image: tripThailand,
    gradient: 'from-purple-900/80 to-navy/90',
  },
  {
    day: 2,
    title: 'Temple Sunrise',
    description: 'Wake before dawn for a magical sunrise at Wat Arun. Traditional Thai breakfast.',
    icon: <Sun className="w-5 h-5" />,
    image: tripBali,
    gradient: 'from-amber-900/80 to-navy/90',
  },
  {
    day: 3,
    title: 'Street Food Safari',
    description: 'Explore hidden alleys with a local guide. Taste the best Pad Thai in the city.',
    icon: <Utensils className="w-5 h-5" />,
    image: tripVietnam,
    gradient: 'from-red-900/80 to-navy/90',
  },
  {
    day: 4,
    title: 'Island Paradise',
    description: 'Speedboat to crystal waters. Snorkeling, beach BBQ, and sunset cocktails.',
    icon: <Camera className="w-5 h-5" />,
    image: tripBali,
    gradient: 'from-cyan-900/80 to-navy/90',
  },
  {
    day: 5,
    title: 'Farewell Memories',
    description: 'Morning spa rituals. Emotional goodbye brunch with your new lifelong friends.',
    icon: <Heart className="w-5 h-5" />,
    image: tripThailand,
    gradient: 'from-pink-900/80 to-navy/90',
  },
];

export const ItineraryPreviewSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[300vh] bg-navy">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background */}
        {itinerary.map((item, index) => {
          const start = index / itinerary.length;
          const end = (index + 1) / itinerary.length;
          
          return (
            <motion.div
              key={item.day}
              className="absolute inset-0"
              style={{
                opacity: useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]),
                y: backgroundY,
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-b ${item.gradient}`} />
            </motion.div>
          );
        })}

        {/* Film Grain Overlay */}
        <div className="film-grain" />

        {/* Content */}
        <motion.div className="relative z-10 container mx-auto px-4" style={{ opacity }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amigo-orange via-amigo-orange/50 to-transparent" />
              
              <motion.div
                className="absolute left-6 top-0 w-0.5 bg-amigo-orange origin-top"
                style={{
                  scaleY: scrollYProgress,
                  height: '100%',
                }}
              />

              {/* Day Items */}
              <div className="space-y-8">
                {itinerary.map((item, index) => {
                  const start = index / itinerary.length;
                  const isActiveRange = [start, start + 0.15];
                  
                  return (
                    <motion.div
                      key={item.day}
                      className="relative pl-16"
                      style={{
                        opacity: useTransform(scrollYProgress, isActiveRange, [0.3, 1]),
                        x: useTransform(scrollYProgress, isActiveRange, [-20, 0]),
                      }}
                    >
                      {/* Day Marker */}
                      <motion.div
                        className="absolute left-0 w-12 h-12 rounded-full bg-navy border-2 border-amigo-orange flex items-center justify-center text-amigo-orange"
                        style={{
                          scale: useTransform(scrollYProgress, isActiveRange, [0.8, 1.1]),
                        }}
                      >
                        {item.icon}
                      </motion.div>

                      {/* Content Card */}
                      <div className="glass-card p-5 rounded-xl">
                        <span className="text-amigo-orange font-mono text-sm">Day {item.day}</span>
                        <h3 className="font-serif text-xl text-foreground mt-1">{item.title}</h3>
                        <p className="text-muted-foreground text-sm mt-2">{item.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right - Feature Text */}
            <div className="text-center lg:text-left">
              <motion.span
                className="text-amigo-orange font-medium text-sm tracking-wider uppercase mb-4 block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Experience Before You Book
              </motion.span>
              <motion.h2
                className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Your Thailand
                <br />
                <span className="text-amigo-orange">Adventure</span>
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-lg mb-8 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Five days of unforgettable moments. From ancient temples to hidden beaches,
                every day brings a new story.
              </motion.p>
              <motion.button
                className="magnetic-btn px-8 py-4 bg-amigo-orange text-navy font-semibold rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Full Itinerary
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
