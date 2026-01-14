import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { HeroSectionV2, AppSyncSection, FlashPackBentoGrid, InfiniteMemoryReel, MarkerPenTestimonials } from '@/components/HeroSectionV2';
import { CursorSpotlight } from '@/components/v2/CursorSpotlight';
import { TripSearchBar } from '@/components/TripSearchBar';
import { MeetYourTribeSection } from '@/components/MeetYourTribeSection';
import { AmigoWaySection } from '@/components/AmigoWaySection';
import { ItineraryPreviewSection } from '@/components/ItineraryPreviewSection';
import { MemoryReelSection } from '@/components/MemoryReelSection';
import { TrustShieldSection } from '@/components/TrustShieldSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { CountdownBannerSection } from '@/components/CountdownBannerSection';
import { TravelQuizSection } from '@/components/TravelQuizSection';
import { TravelStoriesSection } from '@/components/TravelStoriesSection';
import { Footer } from '@/components/Footer';
import { ChatFab } from '@/components/ChatFab';

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
          <MeetYourTribeSection />
          <AmigoWaySection />
          <ItineraryPreviewSection />
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
