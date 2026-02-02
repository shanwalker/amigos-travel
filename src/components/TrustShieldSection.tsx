import { motion } from 'framer-motion';
import { Headphones, Sparkles, Radio, HeartHandshake, ShieldCheck } from 'lucide-react';

export const TrustShieldSection = () => {
  const features = [
    {
      icon: <Headphones className="w-8 h-8" />,
      title: '24/7 Trip Support',
      desc: 'Real humans, always there for you.',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Personalised Trips',
      desc: 'Itineraries crafted around your vibe.',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    {
      icon: <Radio className="w-8 h-8" />,
      title: 'Real Time Travellers',
      desc: 'Connect with real travellers from our community.',
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      pulse: true
    },
    {
      icon: <HeartHandshake className="w-8 h-8" />,
      title: 'Like-Minded People',
      desc: 'Travel with your kind of tribe.',
      color: 'text-orange-400',
      bg: 'bg-orange-400/10'
    }
  ];

  return (
    <section className="pt-16 pb-24 md:py-20 bg-navy-deep relative overflow-hidden">
      {/* Subtle Background Grid - Optimized with lazy loading CSS or simpler opacity */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:30px_30px]" />

      {/* Central Glow - Reduced blur for mobile performance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] bg-primary/10 blur-[60px] md:blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-4"
          >
            <ShieldCheck className="w-4 h-4" />
            Safety First
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-jakarta text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
          >
            Travel with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Confidence</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-base md:text-lg max-w-2xl mx-auto"
          >
            We've got your back. From planning to landing, experience seamless journeys with our premium support network.
          </motion.p>
        </div>

        {/* Features Grid - Improved mobile grid gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className="h-full p-6 bg-white/[0.02] backdrop-blur-sm border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-300 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-primary/5">

                {/* Icon Circle */}
                <div className={`w-16 h-16 rounded-full ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative`}>
                  {feature.icon}
                  {feature.pulse && (
                    <div className="absolute inset-0 rounded-full border border-green-400/50 animate-ping" />
                  )}
                </div>

                <h3 className="font-jakarta text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                <p className="text-white/70 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
