import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface FloatingPhoneProps {
  className?: string;
}

export const FloatingPhone = ({ className = '' }: FloatingPhoneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // 3D rotation based on scroll
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 10]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <div ref={containerRef} className={`perspective-1000 ${className}`}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          y,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="relative"
      >
        {/* Phone Frame */}
        <div className="relative w-[280px] h-[580px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8),0_30px_60px_-10px_rgba(0,0,0,0.6)]">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-800" />
            <div className="w-3 h-3 rounded-full bg-gray-800 ring-1 ring-gray-700" />
          </div>
          
          {/* Screen */}
          <div className="relative w-full h-full bg-superlist-dark rounded-[2.5rem] overflow-hidden">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 pt-2 z-10">
              <span className="text-xs font-medium text-foreground/70">9:41</span>
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-2 bg-foreground/70 rounded-full" />
                  <div className="w-0.5 h-2.5 bg-foreground/70 rounded-full" />
                  <div className="w-0.5 h-3 bg-foreground/70 rounded-full" />
                  <div className="w-0.5 h-3.5 bg-foreground/70 rounded-full" />
                </div>
                <div className="w-6 h-3 border border-foreground/70 rounded-sm ml-1">
                  <div className="w-4 h-full bg-green-400 rounded-sm" />
                </div>
              </div>
            </div>
            
            {/* App Content */}
            <div className="absolute inset-0 pt-14 pb-8 px-4">
              {/* Travel Amigo App UI */}
              <div className="h-full flex flex-col">
                {/* App Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-luxury font-bold text-foreground">
                    Travel<span className="text-primary">Amigo</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amigo-orange to-amigo-glow" />
                </div>

                {/* Featured Trip Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative rounded-2xl overflow-hidden mb-4 flex-shrink-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500" />
                  <div className="relative p-4">
                    <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur rounded-full text-[10px] font-medium text-white mb-2">
                      🔥 Trending
                    </span>
                    <h4 className="text-sm font-bold text-white mb-1">Bali & Beyond</h4>
                    <p className="text-[10px] text-white/80">12 days • 8 spots left</p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border border-white"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-white/70">+5 joined</span>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {['Explore', 'Groups', 'Chat'].map((action, i) => (
                    <motion.div
                      key={action}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      </div>
                      <span className="text-[9px] text-foreground/70">{action}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Upcoming Trip */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium text-foreground/50 uppercase tracking-wider">
                      Next Adventure
                    </span>
                    <span className="text-[10px] text-primary">View All</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl">
                      🇻🇳
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xs font-semibold text-foreground">Vietnam Discovery</h5>
                      <p className="text-[10px] text-foreground/50">Feb 5 - Feb 17</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-primary">12</p>
                      <p className="text-[8px] text-foreground/50">days left</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-foreground/30 rounded-full" />
          </div>
        </div>

        {/* Phone Reflection */}
        <div className="absolute -bottom-20 left-0 right-0 h-20 bg-gradient-to-b from-white/5 to-transparent blur-sm transform scale-y-[-1] opacity-30" />
        
        {/* Ambient glow */}
        <div className="absolute -inset-10 bg-gradient-radial from-amigo-orange/20 via-transparent to-transparent blur-3xl -z-10" />
      </motion.div>
    </div>
  );
};
