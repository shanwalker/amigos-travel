import { useState, lazy, Suspense, memo } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/Footer';
import { ChatFab } from '@/components/ChatFab';
import { LazySection } from '@/components/LazySection';

// Lazy load below-the-fold sections
const TripSearchBar = lazy(() => import('@/components/TripSearchBar').then(m => ({ default: m.TripSearchBar })));
const CountdownBannerSection = lazy(() => import('@/components/CountdownBannerSection').then(m => ({ default: m.CountdownBannerSection })));
const MeetYourTribeSection = lazy(() => import('@/components/MeetYourTribeSection').then(m => ({ default: m.MeetYourTribeSection })));
const AmigoWaySection = lazy(() => import('@/components/AmigoWaySection').then(m => ({ default: m.AmigoWaySection })));
const MemoryReelSection = lazy(() => import('@/components/MemoryReelSection').then(m => ({ default: m.MemoryReelSection })));
const TrustShieldSection = lazy(() => import('@/components/TrustShieldSection').then(m => ({ default: m.TrustShieldSection })));
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const TravelQuizSection = lazy(() => import('@/components/TravelQuizSection').then(m => ({ default: m.TravelQuizSection })));
const TravelStoriesSection = lazy(() => import('@/components/TravelStoriesSection').then(m => ({ default: m.TravelStoriesSection })));

// V2 Components - lazy loaded
const CursorSpotlight = lazy(() => import('@/components/v2/CursorSpotlight').then(m => ({ default: m.CursorSpotlight })));
const HeroSectionV2 = lazy(() => import('@/components/HeroSectionV2').then(m => ({ default: m.HeroSectionV2 })));
const AppSyncSection = lazy(() => import('@/components/HeroSectionV2').then(m => ({ default: m.AppSyncSection })));
const FlashPackBentoGrid = lazy(() => import('@/components/HeroSectionV2').then(m => ({ default: m.FlashPackBentoGrid })));
const InfiniteMemoryReel = lazy(() => import('@/components/HeroSectionV2').then(m => ({ default: m.InfiniteMemoryReel })));
const MarkerPenTestimonials = lazy(() => import('@/components/HeroSectionV2').then(m => ({ default: m.MarkerPenTestimonials })));

// Minimal loading placeholder
const SectionLoader = memo(() => (
  <div className="min-h-[100px] flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
));
SectionLoader.displayName = 'SectionLoader';

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
          {/* Critical above-the-fold content - loaded immediately */}
          <HeroSection />
          
          {/* Below-the-fold sections - lazy loaded when scrolled into view */}
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <TripSearchBar />
            </Suspense>
          </LazySection>
          
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <CountdownBannerSection />
            </Suspense>
          </LazySection>
          
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <MeetYourTribeSection />
            </Suspense>
          </LazySection>
          
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <AmigoWaySection />
            </Suspense>
          </LazySection>
          
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <MemoryReelSection />
            </Suspense>
          </LazySection>
          
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <TrustShieldSection />
            </Suspense>
          </LazySection>
          
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <TestimonialsSection />
            </Suspense>
          </LazySection>
          
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <TravelQuizSection />
            </Suspense>
          </LazySection>
          
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <TravelStoriesSection />
            </Suspense>
          </LazySection>
        </>
      ) : (
        <Suspense fallback={<SectionLoader />}>
          <CursorSpotlight />
          <HeroSectionV2 />
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <AppSyncSection />
            </Suspense>
          </LazySection>
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <FlashPackBentoGrid />
            </Suspense>
          </LazySection>
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <InfiniteMemoryReel />
            </Suspense>
          </LazySection>
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <MarkerPenTestimonials />
            </Suspense>
          </LazySection>
        </Suspense>
      )}
      <Footer />
      <ChatFab />
    </div>
  );
};

export default Index;
