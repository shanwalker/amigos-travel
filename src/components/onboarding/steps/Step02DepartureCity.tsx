import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { POPULAR_CITIES } from '@/types/onboarding-quiz';
import { StepHeader, StaggeredContainer, StaggeredItem } from '../StepTransition';

interface Step02Props {
    value: string;
    onChange: (value: string) => void;
}

export function Step02DepartureCity({ value, onChange }: Step02Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredCities = useMemo(() => {
        if (!searchQuery) return POPULAR_CITIES;
        return POPULAR_CITIES.filter(city =>
            city.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const handleCitySelect = (city: string) => {
        onChange(city);
        setSearchQuery('');
        setShowSuggestions(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchQuery(val);
        onChange(val);
        setShowSuggestions(true);
    };

    const handleClear = () => {
        onChange('');
        setSearchQuery('');
    };

    return (
        <div className="w-full max-w-xl mx-auto h-full flex flex-col">
            <StepHeader
                title="Which city will you start from?"
                subtitle="Your departure point"
                emoji="🛫"
            />

            {/* Search Input */}
            <div className="relative mb-4 sm:mb-6 flex-none">
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <input
                        type="text"
                        value={value || searchQuery}
                        onChange={handleInputChange}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Type your city..."
                        className="w-full pl-10 pr-10 py-3 sm:pl-12 sm:pr-12 sm:py-4 bg-white/5 border-2 border-white/10 rounded-xl text-sm sm:text-base text-white placeholder-white/40 focus:border-primary focus:outline-none transition-all"
                    />
                    {(value || searchQuery) && (
                        <button
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                            <X className="w-3 h-3 text-white/60" />
                        </button>
                    )}
                </div>

                {/* Dropdown Suggestions */}
                <AnimatePresence>
                    {showSuggestions && filteredCities.length > 0 && !value && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-2 bg-navy-deep/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-48 sm:max-h-60 overflow-y-auto"
                        >
                            {filteredCities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => handleCitySelect(city)}
                                    className="w-full px-4 py-2.5 sm:py-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3"
                                >
                                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                                    <span className="text-white text-sm sm:text-base">{city}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Quick Select - Popular Cities */}
            <div className="space-y-2 flex-col overflow-hidden items-center hidden sm:flex">
                <p className="text-white/50 text-xs sm:text-sm">Popular departure cities</p>
                <StaggeredContainer className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                    {POPULAR_CITIES.slice(0, 10).map((city) => (
                        <StaggeredItem key={city}>
                            <motion.button
                                onClick={() => handleCitySelect(city)}
                                className={cn(
                                    "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all",
                                    value === city
                                        ? "bg-primary text-navy-deep"
                                        : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:border-white/20"
                                )}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {city}
                            </motion.button>
                        </StaggeredItem>
                    ))}
                </StaggeredContainer>
            </div>

            {/* Mobile Only: Simple List for Popular if not searching */}
            {!showSuggestions && (
                <div className="flex-1 overflow-y-auto sm:hidden space-y-2 mt-2 pr-1">
                    <p className="text-white/50 text-xs">Popular cities:</p>
                    <div className="grid grid-cols-2 gap-2">
                        {POPULAR_CITIES.slice(0, 8).map((city) => (
                            <button
                                key={city}
                                onClick={() => handleCitySelect(city)}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-xs font-medium transition-all text-left truncate border",
                                    value === city
                                        ? "bg-primary text-navy-deep border-primary"
                                        : "bg-white/5 text-white/70 border-white/10"
                                )}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Step02DepartureCity;
