import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Clock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { HeroSectionV2, AppSyncSection, FlashPackBentoGrid, InfiniteMemoryReel, MarkerPenTestimonials } from '@/components/HeroSectionV2';
import { CursorSpotlight } from '@/components/v2/CursorSpotlight';
import { TripSearchBar } from '@/components/TripSearchBar';
import { MeetYourTribeSection } from '@/components/MeetYourTribeSection';
import { AmigoWaySection } from '@/components/AmigoWaySection';
import { MemoryReelSection } from '@/components/MemoryReelSection';
import { TrustShieldSection } from '@/components/TrustShieldSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { CountdownBannerSection } from '@/components/CountdownBannerSection';
import { TravelQuizSection } from '@/components/TravelQuizSection';
import { TravelStoriesSection } from '@/components/TravelStoriesSection';
import { Footer } from '@/components/Footer';
import { ChatFab } from '@/components/ChatFab';
import tripThailand from '@/assets/trip-thailand.jpg';

const ThailandFomoBanner = () => (
  <section className="py-12 md:py-16 bg-navy-deep overflow-hidden">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={tripThailand} alt="Thailand" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                <Clock className="w-3 h-3" />
                LIMITED SPOTS
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card text-xs">
                <MapPin className="w-3 h-3 text-primary" />
                Thailand
              </span>
            </div>
            <h3 className="font-jakarta text-2xl md:text-4xl font-bold text-foreground mb-2">
              Your <span className="text-gradient">Thailand Adventure</span> Awaits
            </h3>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg">
              Experience ancient temples, pristine beaches & vibrant nightlife. Only 6 spots left for March!
            </p>
          </div>

          <Link 
            to="/destinations/thailand"
            className="group flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-all shadow-lg hover:shadow-primary/30"
          >
            Book Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

const Index = () => {
  const [currentVersion, setCurrentVersion] = useState<'v1' | 'v2'>('v1');

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        currentVersion={currentVersion} 
        onVersionChange={setCurrentVersion} 
      />
      {currentVersion === 'v1' ? (
        <>
          <HeroSection />
          <TripSearchBar />
          <ThailandFomoBanner />
          <MeetYourTribeSection />
          <AmigoWaySection />
          <MemoryReelSection />
          <TrustShieldSection />
          <TestimonialsSection />
          <CountdownBannerSection />
          <TravelQuizSection />
          <TravelStoriesSection />
        </>
      ) : (
        <>
          <CursorSpotlight />
          <HeroSectionV2 />
          <AppSyncSection />
          <FlashPackBentoGrid />
          <InfiniteMemoryReel />
          <MarkerPenTestimonials />
        </>
      )}
      <Footer />
      <ChatFab />
    </div>
  );
};

export default Index;
