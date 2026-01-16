import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ItineraryPreviewSection } from '@/components/ItineraryPreviewSection';
import { Footer } from '@/components/Footer';
import tripThailand from '@/assets/trip-thailand.jpg';

const Thailand = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <span className="text-sm text-muted-foreground">Destinations / Thailand</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={tripThailand} 
            alt="Thailand" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy-deep/40 to-navy-deep" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-primary mb-6">
              <MapPin className="w-4 h-4" />
              Southeast Asia
            </span>
            
            <h1 className="font-jakarta text-5xl md:text-7xl font-extrabold text-foreground mb-6">
              <span className="text-gradient">Thailand</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              From ancient temples to pristine beaches, experience the Land of Smiles with fellow adventurers.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm">10-14 Days</span>
              </div>
              <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm">12-18 Travelers</span>
              </div>
              <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm">4.9 Rating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Itinerary Preview Section - Moved from homepage */}
      <ItineraryPreviewSection />

      <Footer />
    </div>
  );
};

export default Thailand;
