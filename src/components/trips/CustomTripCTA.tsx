import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Wand2, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export const CustomTripCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-10 right-[20%] w-24 h-24 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-6">
            <Wand2 className="w-8 h-8 text-primary" />
          </div>

          {/* Content */}
          <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
            Want Something Unique?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Have a specific destination in mind or special requirements? 
            Our travel experts will craft a personalized itinerary just for you.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              'Custom itinerary planning',
              'Flexible dates & budget',
              'Local expertise included',
              'Group or private trips'
            ].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                {feature}
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/custom-trip')}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Wand2 className="w-5 h-5" />
              Request Custom Trip
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.open('https://wa.me/919876543210?text=Hi! I want to plan a custom trip.', '_blank')}
              className="gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Chat With Us
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Free consultation • No obligation • Response within 24 hours
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomTripCTA;
