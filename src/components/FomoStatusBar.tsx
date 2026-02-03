import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MapPin, Clock } from 'lucide-react';

const fomoMessages = [
  { icon: Users, text: '12 people are viewing Bali trips right now', location: 'Bali' },
  { icon: MapPin, text: 'Sarah just booked a Thailand adventure!', location: 'Thailand' },
  { icon: Clock, text: 'Only 3 spots left for the Japan Cherry Blossom trip', location: 'Japan' },
  { icon: Users, text: '8 travelers are planning Vietnam trips', location: 'Vietnam' },
  { icon: MapPin, text: 'Mike just joined the Morocco group tour!', location: 'Morocco' },
];

export const FomoStatusBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % fomoMessages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentMessage = fomoMessages[currentIndex];
  const Icon = currentMessage.icon;

  return (
    <div className="bg-primary/10 border-y border-primary/20 py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center gap-2 text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-foreground/80">{currentMessage.text}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
