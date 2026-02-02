import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Sparkles, Vote, Users, ArrowRight, BrainCircuit, Check } from 'lucide-react';

export const AmigoWaySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  // Custom animations for the "Mini Apps" inside cards

  const QuizVisual = () => {
    const [step, setStep] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setStep((prev) => (prev + 1) % 4);
      }, 1500);
      return () => clearInterval(interval);
    }, []);

    const traits = ["Adventure", "Luxury", "Budget", "Solo"];

    return (
      <div className="relative w-full h-32 bg-navy-light/50 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
        <div className="absolute inset-0 bg-grid-white/[0.05]" />

        {/* Central Brain/AI Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative z-10 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary/50 text-primary"
        >
          <BrainCircuit className="w-6 h-6" />
        </motion.div>

        {/* Orbiting Traits */}
        {traits.map((trait, i) => (
          <motion.div
            key={trait}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: step === i ? 1 : 0.3,
              scale: step === i ? 1.1 : 0.8,
              x: Math.cos(i * (Math.PI / 2)) * 45,
              y: Math.sin(i * (Math.PI / 2)) * 25
            }}
            transition={{ duration: 0.5 }}
            className={`absolute px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${step === i ? 'bg-primary text-navy border-primary' : 'bg-white/5 text-white/40 border-white/10'}`}
          >
            {trait}
            {step === i && <motion.span layoutId="check" className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center"><Check className="w-2 h-2 text-navy" /></motion.span>}
          </motion.div>
        ))}

        {/* Scanning Effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-primary/50 blur-sm"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 3, ease: "linear", repeat: Infinity }}
        />
      </div>
    );
  };

  const VotingVisual = () => {
    return (
      <div className="relative w-full h-32 bg-navy-light/50 rounded-xl overflow-hidden p-4 flex flex-col justify-center gap-3 border border-white/5">
        {[
          { label: 'Bali', width: '70%', color: 'bg-orange-400' },
          { label: 'Vietnam', width: '40%', color: 'bg-white/20' },
          { label: 'Japan', width: '30%', color: 'bg-white/20' }
        ].map((item, i) => (
          <div key={item.label} className="w-full">
            <div className="flex justify-between text-[10px] text-white/60 mb-1">
              <span>{item.label}</span>
              {i === 0 && <span className="text-orange-400 font-bold animate-pulse">Running</span>}
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: item.width }}
                transition={{ duration: 1.5, delay: i * 0.2 }}
                className={`h-full rounded-full ${item.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const TribeVisual = () => {
    return (
      <div className="relative w-full h-32 bg-navy-light/50 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
        {/* Central Group */}
        <div className="flex items-center -space-x-2 md:-space-x-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 20 }}
              whileInView={{ scale: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: i * 0.1 }}
              whileHover={{ y: -5, zIndex: 10 }}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-navy bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-[10px] font-bold text-white relative group cursor-pointer"
            >
              <span className="group-hover:hidden">{String.fromCharCode(64 + i)}</span>
              <span className="hidden group-hover:block text-orange-400">Hi</span>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-2 px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[10px] font-bold flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Vibe Matched
        </motion.div>
      </div>
    );
  };

  const cards = [
    {
      id: 0,
      visual: <QuizVisual />,
      icon: <Sparkles className="w-5 h-5" />,
      title: "The Match",
      badge: "AI Powered",
      description: "It starts with you. Take our Travel Quiz and let our AI handle the matchmaking. We find the trips that fit your vibe perfectly.",
    },
    {
      id: 1,
      visual: <VotingVisual />,
      icon: <Vote className="w-5 h-5" />,
      title: "The Vote",
      badge: "Democratic",
      description: "Don't just join a trip, shape it. Vote on destinations and activities with your group. The majority rules, making every trip unique.",
    },
    {
      id: 2,
      visual: <TribeVisual />,
      icon: <Users className="w-5 h-5" />,
      title: "The Tribe",
      badge: "Curated Groups",
      description: "Travel with strangers who become family. We curate groups based on shared interests and energy levels. No awkward vibes, just Amigos.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="amigo-way"
      className="relative py-16 md:py-24 bg-navy-deep overflow-hidden scroll-mt-24"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full mix-blend-screen opacity-50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6"
          >
            The <span className="text-gradient">Amigo</span> Way
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-white/60 font-sans max-w-2xl mx-auto"
          >
            We've reimagined group travel. It's not just about the destination; it's about how you get there and who you go with.
          </motion.p>
        </div>

        {/* 3 Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-2 md:p-3 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 flex flex-col">

                {/* Visual Content Area */}
                <div className="rounded-2xl overflow-hidden mb-6">
                  {card.visual}
                </div>

                {/* Text Content */}
                <div className="px-4 pb-6 flex-grow flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary border border-white/10 group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary/80 bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-white/50 text-sm leading-relaxed mb-6">
                    {card.description}
                  </p>

                  {/* Learn More / Action */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-white/80 text-sm font-semibold group-hover:text-primary transition-colors cursor-pointer">
                    Explore this way <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
