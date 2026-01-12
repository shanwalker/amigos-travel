import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Calendar, Vote, Users, ChevronRight } from 'lucide-react';

interface CardData {
  id: number;
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
  feature?: React.ReactNode;
}

export const AmigoWaySection = () => {
  const [activeCard, setActiveCard] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-40%" });

  const cards: CardData[] = [
    {
      id: 0,
      icon: <Calendar className="w-8 h-8" />,
      badge: "Jan 25 Departures",
      title: "Fixed Groups",
      description: "Confirmed groups with set dates. Just pack your bags and go. No planning, no stress.",
      feature: (
        <div className="flex gap-2 mt-4">
          {['Jan 15', 'Jan 22', 'Feb 5'].map((date) => (
            <span key={date} className="px-3 py-1.5 bg-primary/20 text-primary text-sm rounded-full font-inter">
              {date}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 1,
      icon: <Vote className="w-8 h-8" />,
      badge: "Democratic Travel",
      title: "Flexible / Vote",
      description: "Not sure where to go? Vote with your tribe. The destination with the most votes wins!",
      feature: (
        <div className="mt-4 space-y-3">
          <div className="relative h-3 bg-navy-light rounded-full overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-amigo-glow rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            {/* Liquid wave effect */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/50 to-transparent rounded-full"
              animate={{ 
                width: ['55%', '62%', '58%', '60%'],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className="text-sm text-muted-foreground font-inter">
            <span className="text-primary font-semibold">12 Amigos</span> voted. Need 8 more.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      icon: <Users className="w-8 h-8" />,
      badge: "Family Adventure",
      title: "Open Tribe",
      description: "Join families and open groups. Perfect for solo travelers who want a family vibe.",
      feature: (
        <div className="mt-4">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: -20 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/40 to-navy-light border-2 border-navy-deep flex items-center justify-center text-foreground text-sm font-bold shadow-lg"
              >
                {['SR', 'AR', 'PK', '+3'][i - 1]}
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground font-inter mt-3">
            The <span className="text-primary font-semibold">Reddy Family</span> is hosting in Vietnam
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % cards.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isInView, cards.length]);

  const cardVariants = {
    enter: { 
      opacity: 0, 
      rotateY: -15, 
      x: 100, 
      z: -100,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    },
    center: { 
      opacity: 1, 
      rotateY: 0, 
      x: 0, 
      z: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    },
    exit: { 
      opacity: 0, 
      rotateY: 15, 
      x: -100, 
      z: -100,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    },
  };

  return (
    <section 
      ref={sectionRef}
      id="amigo-way"
      className="relative py-32 bg-navy-gradient overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full glass-card text-sm font-inter font-medium text-primary mb-6">
            🌍 Three Ways to Travel
          </span>
          <h2 className="font-jakarta text-4xl md:text-6xl font-extrabold text-foreground mb-6">
            The <span className="text-gradient">Amigo</span> Way
          </h2>
          <p className="text-lg text-muted-foreground font-inter">
            Choose how you want to travel. Whether you love fixed plans or spontaneous adventures, we've got you covered.
          </p>
        </motion.div>

        {/* 3D Card Display */}
        <div className="relative flex items-center justify-center min-h-[500px]" style={{ perspective: '1000px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full max-w-lg"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="glass-card p-8 md:p-10 relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/30 rounded-full blur-[60px]" />
                
                {/* Badge */}
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary text-sm font-inter font-semibold rounded-full mb-6">
                  {cards[activeCard].icon}
                  {cards[activeCard].badge}
                </span>

                {/* Content */}
                <h3 className="font-jakarta text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {cards[activeCard].title}
                </h3>
                <p className="text-muted-foreground font-inter text-lg">
                  {cards[activeCard].description}
                </p>

                {/* Feature */}
                {cards[activeCard].feature}

                {/* Learn More */}
                <button className="flex items-center gap-2 mt-8 text-primary font-inter font-semibold hover:gap-4 transition-all">
                  Learn More <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveCard(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                activeCard === index 
                  ? 'bg-primary w-8' 
                  : 'bg-foreground/20 hover:bg-foreground/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
