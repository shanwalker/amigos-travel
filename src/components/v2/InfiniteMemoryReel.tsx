import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, Play } from 'lucide-react';
import { TextReveal } from './TextReveal';
import reel1 from '@/assets/reel-1.jpg';
import reel2 from '@/assets/reel-2.jpg';
import reel3 from '@/assets/reel-3.jpg';
import reel4 from '@/assets/reel-4.jpg';
import reel5 from '@/assets/reel-5.jpg';
import reel6 from '@/assets/reel-6.jpg';

interface MemoryItem {
  id: number;
  image: string;
  location: string;
  country: string;
  isVideo?: boolean;
}

const row1Items: MemoryItem[] = [
  { id: 1, image: reel1, location: "Ubud Rice Terraces", country: "Bali" },
  { id: 2, image: reel2, location: "Tokyo Shibuya", country: "Japan", isVideo: true },
  { id: 3, image: reel3, location: "Phi Phi Islands", country: "Thailand" },
  { id: 4, image: reel4, location: "Ha Long Bay", country: "Vietnam" },
  { id: 5, image: reel5, location: "Santorini Sunset", country: "Greece", isVideo: true },
  { id: 6, image: reel6, location: "Chiang Mai Temple", country: "Thailand" },
];

const row2Items: MemoryItem[] = [
  { id: 7, image: reel4, location: "Kyoto Gardens", country: "Japan" },
  { id: 8, image: reel1, location: "Bali Beach", country: "Indonesia", isVideo: true },
  { id: 9, image: reel5, location: "Bangkok Streets", country: "Thailand" },
  { id: 10, image: reel2, location: "Nusa Penida", country: "Bali" },
  { id: 11, image: reel6, location: "Hoi An Lanterns", country: "Vietnam", isVideo: true },
  { id: 12, image: reel3, location: "Mount Fuji", country: "Japan" },
];

const MemoryCard = ({ item, reverse = false }: { item: MemoryItem; reverse?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-72 h-48 md:w-80 md:h-56 rounded-2xl overflow-hidden flex-shrink-0 mx-3 cursor-pointer"
      whileHover={{ 
        scale: 1.05, 
        zIndex: 10,
        rotateY: reverse ? -5 : 5,
        translateZ: 50 
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <img 
        src={item.image} 
        alt={item.location}
        className="w-full h-full object-cover"
      />
      
      {/* Video indicator */}
      {item.isVideo && (
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <Play className="w-5 h-5 text-white fill-white" />
        </div>
      )}

      {/* Overlay on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/50 to-transparent flex flex-col justify-end p-4"
          >
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-jakarta font-semibold text-sm">{item.location}</span>
            </div>
            <span className="text-muted-foreground text-xs ml-6">{item.country}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Film strip holes */}
      <div className="absolute top-0 left-0 right-0 h-4 flex justify-around items-center bg-black/30">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-sm bg-white/20" />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-4 flex justify-around items-center bg-black/30">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-sm bg-white/20" />
        ))}
      </div>
    </motion.div>
  );
};

export const InfiniteMemoryReel = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-20 bg-navy-deep overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-primary font-jakarta font-semibold text-sm uppercase tracking-wider">
            Captured Moments
          </span>
          <h2 className="font-jakarta text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            <TextReveal>Memories in Motion</TextReveal>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real stories from real Amigos. Every frame is a lifetime memory waiting to happen.
          </p>
        </motion.div>
      </div>

      {/* Reels Container */}
      <div 
        className="space-y-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Row 1 - Scrolls Left */}
        <div className="relative">
          <div 
            className={`flex ${isPaused ? '' : 'infinite-scroll'}`}
            style={{ width: 'fit-content' }}
          >
            {[...row1Items, ...row1Items].map((item, index) => (
              <MemoryCard key={`row1-${item.id}-${index}`} item={item} />
            ))}
          </div>
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-navy-deep to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-navy-deep to-transparent pointer-events-none" />
        </div>

        {/* Row 2 - Scrolls Right */}
        <div className="relative">
          <div 
            className={`flex ${isPaused ? '' : 'infinite-scroll-reverse'}`}
            style={{ width: 'fit-content' }}
          >
            {[...row2Items, ...row2Items].map((item, index) => (
              <MemoryCard key={`row2-${item.id}-${index}`} item={item} reverse />
            ))}
          </div>
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-navy-deep to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-navy-deep to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
