import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import reel1 from '@/assets/reel-1.jpg';
import reel2 from '@/assets/reel-2.jpg';
import reel3 from '@/assets/reel-3.jpg';
import reel4 from '@/assets/reel-4.jpg';
import reel5 from '@/assets/reel-5.jpg';
import reel6 from '@/assets/reel-6.jpg';

const reelImages = [
  { src: reel1, location: 'Santorini, Greece' },
  { src: reel2, location: 'Sapa, Vietnam' },
  { src: reel3, location: 'Phuket, Thailand' },
  { src: reel4, location: 'Kyoto, Japan' },
  { src: reel5, location: 'Phi Phi Islands' },
  { src: reel6, location: 'Cappadocia, Turkey' },
];

export const MemoryReelSection = () => {
  const [selectedImage, setSelectedImage] = useState<typeof reelImages[0] | null>(null);

  const ReelItem = ({ image, index }: { image: typeof reelImages[0]; index: number }) => (
    <motion.div
      whileHover={{ scale: 1.05, z: 50 }}
      onClick={() => setSelectedImage(image)}
      className="relative flex-shrink-0 w-48 md:w-64 h-72 md:h-96 rounded-2xl overflow-hidden cursor-pointer group mx-2"
      style={{ 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}
    >
      <img 
        src={image.src} 
        alt={image.location}
        loading="lazy"
        decoding="async"
        width={192}
        height={300}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Location Tag */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-4 right-4 flex items-center gap-2 px-3 py-2 glass-card rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-sm text-foreground font-inter">{image.location}</span>
      </motion.div>
    </motion.div>
  );

  return (
    <section id="community" className="relative py-24 bg-navy-deep overflow-hidden">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 text-center mb-16"
      >
        <span className="inline-block px-4 py-2 rounded-full glass-card text-sm font-inter font-medium text-primary mb-6">
          📸 Real Moments, Real People
        </span>
        <h2 className="font-jakarta text-4xl md:text-6xl font-extrabold text-foreground mb-6">
          The <span className="text-gradient">Memory</span> Reel
        </h2>
        <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
          Thousands of memories from our global community. These aren't stock photos—they're real moments from real Amigos.
        </p>
      </motion.div>

      {/* Infinite Scroll Row 1 - Left */}
      <div className="relative mb-6 overflow-hidden">
        <div className="infinite-scroll">
          {[...reelImages, ...reelImages].map((image, index) => (
            <ReelItem key={`row1-${index}`} image={image} index={index} />
          ))}
        </div>
      </div>

      {/* Infinite Scroll Row 2 - Right */}
      <div className="relative overflow-hidden">
        <div className="infinite-scroll-reverse">
          {[...reelImages.reverse(), ...reelImages].map((image, index) => (
            <ReelItem key={`row2-${index}`} image={image} index={index} />
          ))}
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-navy-deep to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-navy-deep to-transparent pointer-events-none z-10" />

      {/* Full Screen Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-navy-deep/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
        >
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.src} 
              alt={selectedImage.location}
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute bottom-6 left-6 flex items-center gap-3 px-4 py-3 glass-card rounded-xl">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-lg text-foreground font-inter font-medium">{selectedImage.location}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};
