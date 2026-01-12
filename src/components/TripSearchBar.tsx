import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Compass, CalendarDays, Search, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { MagneticButton } from './ui/animations';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const destinations = [
  { id: 'thailand', name: 'Thailand', region: 'Southeast Asia' },
  { id: 'bali', name: 'Bali', region: 'Indonesia' },
  { id: 'vietnam', name: 'Vietnam', region: 'Southeast Asia' },
  { id: 'japan', name: 'Japan', region: 'East Asia' },
  { id: 'maldives', name: 'Maldives', region: 'South Asia' },
  { id: 'sri-lanka', name: 'Sri Lanka', region: 'South Asia' },
  { id: 'nepal', name: 'Nepal', region: 'South Asia' },
  { id: 'philippines', name: 'Philippines', region: 'Southeast Asia' },
];

const experiences = [
  { id: 'beaches', name: 'Beaches & Islands', icon: '🏝️' },
  { id: 'mountains', name: 'Mountains & Trekking', icon: '🏔️' },
  { id: 'culture', name: 'Culture & Heritage', icon: '🏛️' },
  { id: 'adventure', name: 'Adventure Sports', icon: '🪂' },
  { id: 'wildlife', name: 'Wildlife & Safari', icon: '🦁' },
  { id: 'food', name: 'Food & Culinary', icon: '🍜' },
  { id: 'nightlife', name: 'Nightlife & Party', icon: '🎉' },
  { id: 'wellness', name: 'Wellness & Spa', icon: '🧘' },
];

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Dropdown = ({ isOpen, onClose, children }: DropdownProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-2 z-50 bg-navy-deep/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const TripSearchBar = () => {
  const [destination, setDestination] = useState('');
  const [experience, setExperience] = useState('');
  const [date, setDate] = useState<Date>();
  const [openDropdown, setOpenDropdown] = useState<'destination' | 'experience' | null>(null);

  const handleDestinationSelect = (name: string) => {
    setDestination(name);
    setOpenDropdown(null);
  };

  const handleExperienceSelect = (name: string) => {
    setExperience(name);
    setOpenDropdown(null);
  };

  return (
    <section className="relative -mt-12 z-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Ambient glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-xl opacity-60" />
          
          {/* Main search bar container */}
          <div className="relative glass-card rounded-2xl p-2 md:p-3 border border-white/10 shadow-2xl shadow-navy-deep/50">
            <div className="flex flex-col lg:flex-row items-stretch gap-2 lg:gap-0">
              
              {/* Destination Field */}
              <div className="flex-1 relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'destination' ? null : 'destination')}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 hover:bg-white/5 text-left group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-sans font-semibold text-primary/80 uppercase tracking-wider mb-1">
                      Destination
                    </label>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-base font-sans truncate",
                        destination ? "text-foreground" : "text-muted-foreground/60"
                      )}>
                        {destination || 'Where do you want to go?'}
                      </span>
                      <ChevronDown className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform ml-2",
                        openDropdown === 'destination' && "rotate-180"
                      )} />
                    </div>
                  </div>
                </button>
                
                <Dropdown isOpen={openDropdown === 'destination'} onClose={() => setOpenDropdown(null)}>
                  <div className="p-2 max-h-[280px] overflow-y-auto">
                    {destinations.map((dest) => (
                      <button
                        key={dest.id}
                        onClick={() => handleDestinationSelect(dest.name)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200",
                          destination === dest.name
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-white/5 text-foreground"
                        )}
                      >
                        <div>
                          <div className="font-sans font-medium">{dest.name}</div>
                          <div className="text-xs text-muted-foreground">{dest.region}</div>
                        </div>
                        {destination === dest.name && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </Dropdown>
                
                {/* Vertical divider */}
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              </div>
              
              {/* Experience Field */}
              <div className="flex-1 relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'experience' ? null : 'experience')}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 hover:bg-white/5 text-left group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-sans font-semibold text-primary/80 uppercase tracking-wider mb-1">
                      Experience
                    </label>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-base font-sans truncate",
                        experience ? "text-foreground" : "text-muted-foreground/60"
                      )}>
                        {experience || 'What do you want to see?'}
                      </span>
                      <ChevronDown className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform ml-2",
                        openDropdown === 'experience' && "rotate-180"
                      )} />
                    </div>
                  </div>
                </button>
                
                <Dropdown isOpen={openDropdown === 'experience'} onClose={() => setOpenDropdown(null)}>
                  <div className="p-2 max-h-[280px] overflow-y-auto">
                    {experiences.map((exp) => (
                      <button
                        key={exp.id}
                        onClick={() => handleExperienceSelect(exp.name)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200",
                          experience === exp.name
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-white/5 text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{exp.icon}</span>
                          <span className="font-sans font-medium">{exp.name}</span>
                        </div>
                        {experience === exp.name && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </Dropdown>
                
                {/* Vertical divider */}
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              </div>
              
              {/* Date Field */}
              <div className="flex-1 relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 hover:bg-white/5 text-left group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-sans font-semibold text-primary/80 uppercase tracking-wider mb-1">
                          When
                        </label>
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-base font-sans truncate",
                            date ? "text-foreground" : "text-muted-foreground/60"
                          )}>
                            {date ? format(date, 'PPP') : 'When do you want to go?'}
                          </span>
                          <ChevronDown className="w-4 h-4 text-muted-foreground ml-2" />
                        </div>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-auto p-0 bg-navy-deep/95 backdrop-blur-xl border-white/10" 
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Search button */}
              <div className="flex-shrink-0 p-2 lg:pl-4">
                <MagneticButton className="w-full lg:w-auto h-full min-h-[56px] px-8 rounded-xl font-semibold flex items-center justify-center gap-3 text-base">
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </MagneticButton>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-6 bg-primary/10 blur-2xl rounded-full" />
        </motion.div>
        
        {/* Quick suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-6"
        >
          <span className="text-xs text-muted-foreground font-sans">Popular:</span>
          {['Thailand', 'Bali', 'Vietnam', 'Japan', 'Maldives'].map((place) => (
            <button
              key={place}
              onClick={() => setDestination(place)}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 text-sm font-sans text-foreground/80 hover:text-primary transition-all duration-300"
            >
              {place}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
