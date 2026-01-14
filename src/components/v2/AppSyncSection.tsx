import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { MessageCircle, Vote, Plane, Check, Users } from 'lucide-react';

interface ChatBubble {
  id: number;
  text: string;
  author: string;
  avatar: string;
  delay: number;
}

const chatBubbles: ChatBubble[] = [
  { id: 1, text: "Vibe is 10/10! 🔥", author: "Priya", avatar: "🧕", delay: 0 },
  { id: 2, text: "See you in Bali!", author: "Arjun", avatar: "👨", delay: 0.3 },
  { id: 3, text: "Best trip ever!", author: "Sneha", avatar: "👩", delay: 0.6 },
  { id: 4, text: "Can't wait! ✈️", author: "Rohan", avatar: "🧑", delay: 0.9 },
];

export const AppSyncSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Phone transformations based on scroll
  const phoneY = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [200, 0, 0, -200]);
  const phoneScale = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0.8, 1, 1, 0.8]);
  const phoneRotateY = useTransform(smoothProgress, [0.3, 0.5, 0.7], [0, 45, 0]);
  const phoneOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Phase detection
  useEffect(() => {
    return smoothProgress.on("change", (v) => {
      if (v < 0.33) setActivePhase(0);
      else if (v < 0.66) setActivePhase(1);
      else setActivePhase(2);
    });
  }, [smoothProgress]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[400vh] bg-navy-deep"
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <motion.div 
            style={{ opacity: useTransform(smoothProgress, [0.3, 0.5], [0, 0.3]) }}
            className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent"
          />
        </div>

        {/* Section Headers */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-20">
          <AnimatePresence mode="wait">
            {activePhase === 0 && (
              <motion.div
                key="phase0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <span className="text-primary font-jakarta font-semibold text-sm uppercase tracking-wider">The Community</span>
                <h2 className="font-jakarta text-4xl md:text-5xl font-bold text-foreground mt-2">Your Tribe Awaits</h2>
              </motion.div>
            )}
            {activePhase === 1 && (
              <motion.div
                key="phase1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <span className="text-primary font-jakarta font-semibold text-sm uppercase tracking-wider">The Vote</span>
                <h2 className="font-jakarta text-4xl md:text-5xl font-bold text-foreground mt-2">Democracy in Travel</h2>
              </motion.div>
            )}
            {activePhase === 2 && (
              <motion.div
                key="phase2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <span className="text-primary font-jakarta font-semibold text-sm uppercase tracking-wider">Confirmed</span>
                <h2 className="font-jakarta text-4xl md:text-5xl font-bold text-foreground mt-2">Your Pass is Ready</h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3D Phone Container */}
        <div className="phone-3d relative">
          <motion.div
            style={{ 
              y: phoneY, 
              scale: phoneScale, 
              rotateY: phoneRotateY,
              opacity: phoneOpacity
            }}
            className="relative"
          >
            {/* Phone Frame */}
            <div className="phone-titanium w-[280px] md:w-[320px] h-[580px] md:h-[660px] rounded-[50px] p-3 relative">
              {/* Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-10" />
              
              {/* Phone Screen */}
              <div className="w-full h-full rounded-[42px] bg-navy-deep overflow-hidden relative">
                {/* Phase 1: Group Chat */}
                <AnimatePresence>
                  {activePhase === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 p-4 pt-12"
                    >
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-jakarta font-bold text-foreground text-sm">Bali Gang 🌴</h4>
                          <p className="text-xs text-muted-foreground">18 members online</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {chatBubbles.map((bubble) => (
                          <motion.div
                            key={bubble.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: bubble.delay }}
                            className="flex items-start gap-2"
                          >
                            <span className="text-xl">{bubble.avatar}</span>
                            <div className="glass-card px-3 py-2 rounded-2xl rounded-tl-sm max-w-[80%]">
                              <p className="text-xs text-muted-foreground mb-0.5">{bubble.author}</p>
                              <p className="text-sm text-foreground">{bubble.text}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Phase 2: Voting Dashboard */}
                <AnimatePresence>
                  {activePhase === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 p-4 pt-12"
                    >
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Vote className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-jakarta font-bold text-foreground text-sm">Trip Voting</h4>
                          <p className="text-xs text-muted-foreground">Choose your adventure</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="glass-card p-4 rounded-2xl">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-jakarta font-semibold text-foreground text-sm">Bali Beach Week</span>
                            <span className="text-primary font-bold text-sm">12 votes</span>
                          </div>
                          <div className="h-3 rounded-full bg-background/30 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '75%' }}
                              transition={{ duration: 1.5 }}
                              className="h-full liquid-progress rounded-full"
                            />
                          </div>
                        </div>

                        <div className="glass-card p-4 rounded-2xl">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-jakarta font-semibold text-foreground text-sm">Mountain Trek</span>
                            <span className="text-muted-foreground font-bold text-sm">4 votes</span>
                          </div>
                          <div className="h-3 rounded-full bg-background/30 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '25%' }}
                              transition={{ duration: 1.5 }}
                              className="h-full bg-muted rounded-full"
                            />
                          </div>
                        </div>

                        <div className="text-center mt-6">
                          <p className="text-primary font-display text-3xl font-bold">12/20</p>
                          <p className="text-muted-foreground text-xs">Amigos Joined • 8 spots left!</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Phase 3: Boarding Pass */}
                <AnimatePresence>
                  {activePhase === 2 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 p-4 pt-12 flex items-center justify-center"
                    >
                      <div className="boarding-pass-gold w-full rounded-3xl p-6 text-navy-deep relative overflow-hidden">
                        {/* Perforated edge effect */}
                        <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col justify-around">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-4 h-4 rounded-full bg-navy-deep" />
                          ))}
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <Plane className="w-6 h-6" />
                          <span className="font-jakarta font-bold text-lg">BOARDING PASS</span>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-xs opacity-70">PASSENGER</p>
                            <p className="font-jakarta font-bold">TRAVEL AMIGO</p>
                          </div>
                          <div className="flex justify-between">
                            <div>
                              <p className="text-xs opacity-70">FROM</p>
                              <p className="font-jakarta font-bold text-2xl">HYD</p>
                            </div>
                            <Plane className="w-8 h-8 rotate-45 opacity-50" />
                            <div className="text-right">
                              <p className="text-xs opacity-70">TO</p>
                              <p className="font-jakarta font-bold text-2xl">DPS</p>
                            </div>
                          </div>
                          <div className="flex justify-between pt-4 border-t border-navy-deep/20">
                            <div>
                              <p className="text-xs opacity-70">DATE</p>
                              <p className="font-jakarta font-bold">JAN 28</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs opacity-70">GROUP</p>
                              <p className="font-jakarta font-bold">AMIGO #42</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2 bg-navy-deep/10 rounded-xl py-3">
                          <Check className="w-5 h-5" />
                          <span className="font-jakarta font-bold">CONFIRMED</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Floating Chat Bubbles (3D effect) */}
            {activePhase === 0 && (
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, x: -100, y: 50 }}
                  animate={{ opacity: 1, x: -150, y: 30 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute left-0 top-1/4 glass-card px-4 py-2 rounded-xl"
                >
                  <p className="text-sm text-foreground">Best trip ever! 🔥</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 100, y: -50 }}
                  animate={{ opacity: 1, x: 150, y: -80 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="absolute right-0 top-1/3 glass-card px-4 py-2 rounded-xl"
                >
                  <p className="text-sm text-foreground">See you in Bali! ✈️</p>
                </motion.div>
              </div>
            )}

            {/* Flying Airplane (Phase 3) */}
            {activePhase === 2 && (
              <motion.div
                initial={{ x: 200, y: 200, rotate: 0, opacity: 0 }}
                animate={{ 
                  x: [-200, 0, 200], 
                  y: [200, -100, -300], 
                  rotate: [0, -30, -60],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 3, times: [0, 0.5, 1] }}
                className="absolute text-primary"
              >
                <Plane className="w-16 h-16" />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Phase Indicators */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
          {[0, 1, 2].map((phase) => (
            <motion.div
              key={phase}
              className={`w-3 h-3 rounded-full transition-colors ${
                activePhase === phase ? 'bg-primary' : 'bg-foreground/20'
              }`}
              animate={{ scale: activePhase === phase ? 1.2 : 1 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
