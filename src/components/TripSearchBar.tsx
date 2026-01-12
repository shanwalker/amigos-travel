import { motion } from 'framer-motion';
import { MapPin, Compass, CalendarDays, Search } from 'lucide-react';
import { useState } from 'react';
import { MagneticButton } from './ui/animations';

interface SearchField {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
}

export const TripSearchBar = () => {
  const [destination, setDestination] = useState('');
  const [experience, setExperience] = useState('');
  const [date, setDate] = useState('');

  const fields: SearchField[] = [
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Destination',
      placeholder: 'Where do you want to go?',
      value: destination,
    },
    {
      icon: <Compass className="w-5 h-5" />,
      label: 'Experience',
      placeholder: 'What do you want to see?',
      value: experience,
    },
    {
      icon: <CalendarDays className="w-5 h-5" />,
      label: 'When',
      placeholder: 'When do you want to go?',
      value: date,
    },
  ];

  const handleChange = (index: number, value: string) => {
    if (index === 0) setDestination(value);
    else if (index === 1) setExperience(value);
    else setDate(value);
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
              {fields.map((field, index) => (
                <div key={field.label} className="flex-1 flex items-center group">
                  {/* Field container */}
                  <div className="w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 hover:bg-white/5 focus-within:bg-white/5">
                    {/* Icon with gradient background */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                      {field.icon}
                    </div>
                    
                    {/* Input area */}
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-sans font-semibold text-primary/80 uppercase tracking-wider mb-1">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-foreground font-sans text-base placeholder:text-muted-foreground/60 focus:placeholder:text-muted-foreground/40 transition-colors"
                      />
                    </div>
                  </div>
                  
                  {/* Vertical divider */}
                  {index < fields.length - 1 && (
                    <div className="hidden lg:block w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-2" />
                  )}
                </div>
              ))}
              
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
