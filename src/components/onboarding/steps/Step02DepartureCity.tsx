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
        <div className="w-full max-w-xl mx-auto">
            <StepHeader
                title="Which city will you start from?"
                subtitle="Your departure point"
                emoji="🛫"
            />

            {/* Search Input */}
            <div className="relative mb-6">
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                    <input
                        type="text"
                        value={value || searchQuery}
                        onChange={handleInputChange}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Type your city or select below..."
                        className="w-full pl-12 pr-12 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/40 focus:border-primary focus:outline-none transition-all"
                    />
                    {(value || searchQuery) && (
                        <button
                            onClick={handleClear}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                            <X className="w-4 h-4 text-white/60" />
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
                            className="absolute z-50 w-full mt-2 bg-navy-deep/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                        >
                            {filteredCities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => handleCitySelect(city)}
                                    className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3"
                                >
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span className="text-white">{city}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Quick Select - Popular Cities */}
            <div className="space-y-3">
                <p className="text-white/50 text-sm">Popular departure cities</p>
                <StaggeredContainer className="flex flex-wrap gap-2">
                    {POPULAR_CITIES.slice(0, 12).map((city) => (
                        <StaggeredItem key={city}>
                            <motion.button
                                onClick={() => handleCitySelect(city)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
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
        </div>
    );
}

export default Step02DepartureCity;
