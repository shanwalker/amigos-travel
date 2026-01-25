import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Gift, MapPin, Users, ArrowRight } from 'lucide-react';

export const SurpriseTripSection = () => {
  const navigate = useNavigate();

  const steps = [
    { icon: <Sparkles className="w-5 h-5" />, title: 'Tell Us Your Vibe', desc: 'Answer a few quick questions' },
    { icon: <MapPin className="w-5 h-5" />, title: 'We Plan Everything', desc: 'Curated by local experts' },
    { icon: <Users className="w-5 h-5" />, title: 'Meet Your Buddy', desc: 'A local guide awaits you' },
    { icon: <Gift className="w-5 h-5" />, title: 'Unwrap the Surprise', desc: 'Discover your destination!' },
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
      
      {/* Floating elements */}
      <motion.div 
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 blur-2xl"
        animate={{ y: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-primary/15 blur-3xl"
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm mb-6">
              <Gift className="w-4 h-4" />
              Our Signature Experience
            </div>

            <h2 className="text-4xl md:text-5xl font-display text-foreground mb-6">
              Don't Know Where to Go?
              <span className="block text-primary mt-2">Let Us Surprise You!</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Tell us your interests and budget, and we'll plan the perfect surprise trip. 
              Get matched with a local buddy who'll show you the hidden gems only locals know about.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                onClick={() => navigate('/signup/surprise')}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
              >
                <Sparkles className="w-5 h-5" />
                Surprise Me!
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                How It Works
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Starting from ₹15,000
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                48hr Response
              </div>
            </div>
          </motion.div>

          {/* Right side - Steps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            id="how-it-works"
            className="relative"
          >
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />
            
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 relative"
                >
                  <div className="w-16 h-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center shrink-0 shadow-lg relative z-10">
                    <div className="text-primary">{step.icon}</div>
                  </div>
                  <div className="pt-2">
                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SurpriseTripSection;
