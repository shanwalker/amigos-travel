import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AmigoWaySection } from '@/components/AmigoWaySection';
import { MemoryReelSection } from '@/components/MemoryReelSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { Footer } from '@/components/Footer';
import { ChatFab } from '@/components/ChatFab';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AmigoWaySection />
      <MemoryReelSection />
      <TestimonialsSection />
      <Footer />
      <ChatFab />
    </div>
  );
};

export default Index;
