import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/logo.png';
import { MagneticButton } from './ui/animations';

interface NavbarProps {
  currentVersion: 'v1' | 'v2';
  onVersionChange: (version: 'v1' | 'v2') => void;
}

export const Navbar = ({ currentVersion, onVersionChange }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Destinations', href: '#destinations' },
    { label: 'The Amigo Way', href: '#amigo-way' },
    { label: 'Community', href: '#community' },
    { label: 'About', href: '#about' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass-card py-3' : 'py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo with version-specific styling */}
        <a href="#" className="flex items-center relative group">
          {currentVersion === 'v1' ? (
            <>
              {/* V1: Solid white background for logo visibility */}
              <div className="absolute -inset-x-4 -inset-y-2.5 bg-white rounded-xl shadow-lg" />
              {/* Hover glow effect */}
              <div className="absolute -inset-4 bg-primary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
              <img 
                src={logo} 
                alt="Travel Amigo" 
                loading="eager"
                fetchPriority="high"
                className="relative h-10 md:h-12 w-auto"
              />
            </>
          ) : (
            <>
              {/* V2: White background with glow */}
              <div className="absolute -inset-x-4 -inset-y-2.5 bg-white rounded-xl shadow-lg shadow-white/20" />
              {/* Ambient glow */}
              <div className="absolute -inset-4 bg-white/40 rounded-2xl blur-xl opacity-80" />
              {/* Hover glow effect */}
              <div className="absolute -inset-5 bg-primary/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
              <img 
                src={logo} 
                alt="Travel Amigo" 
                loading="eager"
                fetchPriority="high"
                className="relative h-10 md:h-12 w-auto"
              />
            </>
          )}
        </a>

        {/* Version Switcher - Simple Buttons */}
        <div className="hidden md:flex items-center gap-1 bg-navy-medium/50 rounded-lg p-1">
          <button
            onClick={() => onVersionChange('v1')}
            className={`px-3 py-1.5 rounded-md text-sm font-sans font-medium transition-all ${
              currentVersion === 'v1'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            V1
          </button>
          <button
            onClick={() => onVersionChange('v2')}
            className={`px-3 py-1.5 rounded-md text-sm font-sans font-medium transition-all ${
              currentVersion === 'v2'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            V2
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-foreground/80 hover:text-foreground font-sans text-sm font-medium transition-colors relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <MagneticButton className="px-6 py-3 text-base">
            Book Now
          </MagneticButton>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden glass-card mt-2 mx-4 p-6 rounded-2xl"
        >
          <div className="flex flex-col gap-4">
            {/* Mobile Version Switcher */}
            <div className="flex items-center gap-2 pb-4 border-b border-foreground/10">
              <span className="text-sm text-muted-foreground font-sans">Version:</span>
              <button
                onClick={() => onVersionChange('v1')}
                className={`px-3 py-1.5 rounded-md text-sm font-sans font-medium transition-all ${
                  currentVersion === 'v1'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground bg-navy-medium/50'
                }`}
              >
                V1
              </button>
              <button
                onClick={() => onVersionChange('v2')}
                className={`px-3 py-1.5 rounded-md text-sm font-sans font-medium transition-all ${
                  currentVersion === 'v2'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground bg-navy-medium/50'
                }`}
              >
                V2
              </button>
            </div>
            
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-foreground font-sans text-lg font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <MagneticButton className="mt-4 w-full text-center">
              Book Now
            </MagneticButton>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
