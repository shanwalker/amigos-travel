import { useState, lazy, Suspense, memo } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroMain } from '@/components/home/HeroMain'; // New Main Hero
import { FomoStatusBar } from '@/components/FomoStatusBar'; // V1 FOMO
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { AmigoWaySection } from '@/components/AmigoWaySection';
import { MemoryReelSection } from '@/components/MemoryReelSection';
import { TrustShieldSection } from '@/components/TrustShieldSection';
import { BlogSection } from '@/components/home/BlogSection'; // New Blog
import { Footer } from '@/components/Footer';
import { LazySection } from '@/components/LazySection';
// V1 Search Bar
import { TripSearchBar } from '@/components/TripSearchBar';

// Minimal loading placeholder
const SectionLoader = memo(() => (
    <div className="min-h-[100px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
));
SectionLoader.displayName = 'SectionLoader';

const IndexMain = () => {
    // We keep the version state to allow switching if the Navbar supports it, 
    // but this page IS the 'Main' version.
    const [currentVersion, setCurrentVersion] = useState<'v1' | 'v2' | 'redesign' | 'main'>('main');

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <Navbar
                currentVersion={currentVersion}
                onVersionChange={setCurrentVersion}
            />

            {/* 1. Hero Section (Hybrid V1/V2) */}
            <HeroMain />

            {/* 2. FOMO / Live Updates (V1) */}
            <FomoStatusBar />

            {/* 3. Search & Trust (V1) */}
            <section className="relative z-20 -mt-8 mb-16 px-4">
                <div className="container mx-auto">
                    <TripSearchBar />

                    {/* Trust Text (Extracted from V1) */}
                    <div className="text-center mt-8">
                        <p className="text-lg font-semibold text-foreground mb-2">
                            Join over <span className="text-primary">10,000 Amigos</span> who have explored the world with us
                        </p>
                        <p className="text-sm text-muted-foreground font-sans">
                            🔒 We respect your privacy—your info is safe with us
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. How It Works (V1) */}
            <LazySection>
                <Suspense fallback={<SectionLoader />}>
                    <HowItWorksSection />
                </Suspense>
            </LazySection>

            {/* 5. The Amigo Way (V1) */}
            <LazySection>
                <Suspense fallback={<SectionLoader />}>
                    <AmigoWaySection />
                </Suspense>
            </LazySection>

            {/* 6. Memory Reel (V1) */}
            <LazySection>
                <Suspense fallback={<SectionLoader />}>
                    <MemoryReelSection />
                </Suspense>
            </LazySection>

            {/* 7. Travel With Confidence (V1) */}
            <LazySection>
                <Suspense fallback={<SectionLoader />}>
                    <TrustShieldSection />
                </Suspense>
            </LazySection>

            {/* 8. Blogs (NEW) */}
            <LazySection>
                <Suspense fallback={<SectionLoader />}>
                    <BlogSection />
                </Suspense>
            </LazySection>

            <Footer />
        </div>
    );
};

export default IndexMain;
