import { useState, lazy, Suspense, memo } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { HeroSectionRedesign } from '@/components/HeroSectionRedesign';
import { HowItWorksSection } from '@/components/HowItWorksSection';
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

// Trip type sections - lazy loaded
const SurpriseTripSection = lazy(() => import('@/components/trips/SurpriseTripSection'));
const FeaturedTripsCarousel = lazy(() => import('@/components/trips/FeaturedTripsCarousel'));
const ReservableTripsGrid = lazy(() => import('@/components/trips/ReservableTripsGrid'));
const StandardPackagesGrid = lazy(() => import('@/components/trips/StandardPackagesGrid'));
const CustomTripCTA = lazy(() => import('@/components/trips/CustomTripCTA'));
const LocalBuddiesSection = lazy(() => import('@/components/buddies/LocalBuddiesSection'));

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
  const [currentVersion, setCurrentVersion] = useState<'v1' | 'v2' | 'redesign'>('v1');

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        currentVersion={currentVersion}
        onVersionChange={setCurrentVersion}
      />
      {currentVersion === 'v1' ? (
        <>
          {/* Original V1 Hero with scrolling trip cards */}
          <HeroSection />

          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <HowItWorksSection />
            </Suspense>
          </LazySection>

          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <TripSearchBar />
            </Suspense>
          </LazySection>

          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <SurpriseTripSection />
            </Suspense>
          </LazySection>

          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <FeaturedTripsCarousel />
            </Suspense>
          </LazySection>

          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <ReservableTripsGrid />
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
              <StandardPackagesGrid />
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
              <LocalBuddiesSection />
            </Suspense>
          </LazySection>

          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <CustomTripCTA />
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
      ) : currentVersion === 'redesign' ? (
        <>
          {/* Redesigned Profile-First Experience */}
          <HeroSectionRedesign />

          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <HowItWorksSection />
            </Suspense>
          </LazySection>

          {/* Below-the-fold sections - lazy loaded when scrolled into view */}
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <TripSearchBar />
            </Suspense>
          </LazySection>

          {/* NEW: Surprise Trip Hero Section */}
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <SurpriseTripSection />
            </Suspense>
          </LazySection>

          {/* NEW: Featured Group Trips Carousel */}
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <FeaturedTripsCarousel />
            </Suspense>
          </LazySection>

          {/* NEW: Reservable Trips Grid */}
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <ReservableTripsGrid />
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

          {/* NEW: Standard Packages Grid */}
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <StandardPackagesGrid />
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

          {/* NEW: Local Buddies Section */}
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <LocalBuddiesSection />
            </Suspense>
          </LazySection>

          {/* NEW: Custom Trip CTA */}
          <LazySection>
            <Suspense fallback={<SectionLoader />}>
              <CustomTripCTA />
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
