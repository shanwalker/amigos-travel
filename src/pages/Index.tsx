import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { HeroSectionV2 } from '@/components/HeroSectionV2';
import { AmigoWaySection } from '@/components/AmigoWaySection';
import { MemoryReelSection } from '@/components/MemoryReelSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { Footer } from '@/components/Footer';
import { ChatFab } from '@/components/ChatFab';
import { VersionSwitcher } from '@/components/VersionSwitcher';

const Index = () => {
  const [currentVersion, setCurrentVersion] = useState<'v1' | 'v2'>('v1');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <VersionSwitcher 
        currentVersion={currentVersion} 
        onVersionChange={setCurrentVersion} 
      />
      {currentVersion === 'v1' ? <HeroSection /> : <HeroSectionV2 />}
      <AmigoWaySection />
      <MemoryReelSection />
      <TestimonialsSection />
      <Footer />
      <ChatFab />
    </div>
  );
};

export default Index;
