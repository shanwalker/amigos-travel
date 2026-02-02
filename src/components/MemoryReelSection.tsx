import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, User, Heart } from 'lucide-react';
import reel1 from '@/assets/reel-1.jpg';
import reel2 from '@/assets/reel-2.jpg';
import reel3 from '@/assets/reel-3.jpg';
import reel4 from '@/assets/reel-4.jpg';
import reel5 from '@/assets/reel-5.jpg';
import reel6 from '@/assets/reel-6.jpg';

const reelImages = [
  { src: reel1, location: 'Santorini, Greece', user: 'Sarah J.', likes: '2.4k' },
  { src: reel2, location: 'Sapa, Vietnam', user: 'Mike T.', likes: '1.8k' },
  { src: reel3, location: 'Phuket, Thailand', user: 'Jessica L.', likes: '3.2k' },
  { src: reel4, location: 'Kyoto, Japan', user: 'David K.', likes: '4.1k' },
  { src: reel5, location: 'Phi Phi Islands', user: 'Emma W.', likes: '2.9k' },
  { src: reel6, location: 'Cappadocia, Turkey', user: 'Alex R.', likes: '5.5k' },
];

export const MemoryReelSection = () => {
  const [selectedImage, setSelectedImage] = useState<typeof reelImages[0] | null>(null);

  const ReelItem = ({ image, index }: { image: typeof reelImages[0]; index: number }) => (
    <motion.div
      whileHover={{ scale: 1.05, y: -10, zLink: 50 }}
      onClick={() => setSelectedImage(image)}
      className="relative flex-shrink-0 w-56 md:w-72 h-80 md:h-[450px] rounded-3xl overflow-hidden cursor-pointer group mx-3 border border-white/10 bg-navy-light/20"
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}
    >
      <img
        src={image.src}
        alt={image.location}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

      {/* Top Badge (User) */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 glass-card rounded-full bg-black/20 backdrop-blur-md border-white/10 opacity-100 transition-opacity duration-300">
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-orange-500 flex items-center justify-center">
          <User className="w-3 h-3 text-white" />
        </div>
        <span className="text-xs text-white font-medium">{image.user}</span>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold tracking-wide">{image.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          <div className="flex items-center gap-1.5 text-xs text-white/70">
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            {image.likes}
          </div>
          <div className="h-1 w-1 rounded-full bg-white/30" />
          <span className="text-xs text-primary font-medium">View Story</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section id="community" className="relative py-20 md:py-32 bg-navy-deep overflow-hidden scroll-mt-24">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen opacity-30 pointer-events-none" />
      <div className="film-grain absolute inset-0 opacity-20 pointer-events-none" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 text-center mb-16 relative z-10"
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-6 hover:bg-white/10 transition-colors cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Join the Movement
        </span>
        <h2 className="font-jakarta text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-red-500">Memory</span> Reel
        </h2>
        <p className="text-lg md:text-xl text-white/60 font-sans max-w-2xl mx-auto leading-relaxed">
          More than just trips. These are the stories, friendships, and unforgettable moments from our global community of Amigos.
        </p>
      </motion.div>

      {/* Infinite Scroll Row 1 - Left */}
      <div className="relative mb-8 overflow-hidden py-4">
        <div className="infinite-scroll pl-4">
          {[...reelImages, ...reelImages, ...reelImages].map((image, index) => (
            <ReelItem key={`row1-${index}`} image={image} index={index} />
          ))}
        </div>
      </div>

      {/* Infinite Scroll Row 2 - Right */}
      <div className="relative overflow-hidden py-4">
        <div className="infinite-scroll-reverse pl-4">
          {[...reelImages].reverse().concat([...reelImages].reverse(), [...reelImages].reverse()).map((image, index) => (
            <ReelItem key={`row2-${index}`} image={image} index={index} />
          ))}
        </div>
      </div>

      {/* Gradient Vignettes */}
      <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-navy-deep to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-navy-deep to-transparent pointer-events-none z-10" />

      {/* Full Screen Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-10"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all z-50 group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-5xl w-full h-full max-h-[85vh] flex flex-col md:flex-row bg-navy-medium rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Side */}
              <div className="w-full md:w-2/3 h-1/2 md:h-full relative overflow-hidden bg-black">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.location}
                  className="w-full h-full object-contain md:object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Detail Side */}
              <div className="w-full md:w-1/3 h-1/2 md:h-full p-6 md:p-8 flex flex-col bg-navy-deep/50 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                      {selectedImage.user.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{selectedImage.user}</h4>
                      <p className="text-white/40 text-xs">Traveller</p>
                    </div>
                  </div>
                  <button className="text-primary text-sm font-semibold hover:text-white transition-colors">
                    Follow
                  </button>
                </div>

                <div className="flex-1">
                  <p className="text-white/80 text-sm leading-relaxed mb-4">
                    "Just captured this amazing moment in {selectedImage.location}! The vibes were absolutely unreal. Only partially captured how beautiful this place truly is."
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">#AmigoTravel</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">#Wanderlust</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">#NoFilter</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {selectedImage.location}
                    </div>
                    <span>2 hours ago</span>
                  </div>

                  <button className="w-full py-3 rounded-xl bg-primary text-navy-deep font-bold hover:bg-white transition-colors flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" />
                    Like this memory
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
