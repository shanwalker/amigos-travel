import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { POPULAR_DESTINATIONS } from '@/types/onboarding-quiz';
import { StepHeader, StaggeredContainer, StaggeredItem } from '../StepTransition';

interface Step05Props {
    value: string[];
    onChange: (value: string[]) => void;
    maxSelections?: number;
}

export function Step05DesiredDestinations({
    value,
    onChange,
    maxSelections = 5
}: Step05Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDestinations = useMemo(() => {
        if (!searchQuery) return POPULAR_DESTINATIONS;
        return POPULAR_DESTINATIONS.filter(dest =>
            dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dest.region.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const toggleDestination = (destName: string) => {
        if (value.includes(destName)) {
            onChange(value.filter(d => d !== destName));
        } else if (value.length < maxSelections) {
            onChange([...value, destName]);
        }
    };

    const removeDestination = (destName: string) => {
        onChange(value.filter(d => d !== destName));
    };

    const groupedByRegion = useMemo(() => {
        const groups: Record<string, typeof POPULAR_DESTINATIONS> = {};
        filteredDestinations.forEach(dest => {
            if (!groups[dest.region]) groups[dest.region] = [];
            groups[dest.region].push(dest);
        });
        return groups;
    }, [filteredDestinations]);

    return (
        <div className="w-full max-w-2xl mx-auto h-full flex flex-col">
            <StepHeader
                title="Select your dream destinations"
                subtitle={`Choose up to ${maxSelections} countries (${value.length}/${maxSelections})`}
                emoji="✈️"
            />

            {/* Selected Destinations - Horizontal Scroll on Mobile */}
            {value.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 flex-none"
                >
                    {value.map(dest => (
                        <motion.span
                            key={dest}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 text-primary rounded-full text-xs font-medium border border-primary/30"
                        >
                            {dest}
                            <button
                                onClick={() => removeDestination(dest)}
                                className="w-3.5 h-3.5 rounded-full bg-primary/30 hover:bg-primary flex items-center justify-center transition-colors"
                            >
                                <X className="w-2.5 h-2.5 text-navy-deep" />
                            </button>
                        </motion.span>
                    ))}
                </motion.div>
            )}

            {/* Search */}
            <div className="relative mb-4 flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:border-primary focus:outline-none transition-all"
                />
            </div>

            {/* Destinations by Region */}
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin min-h-0">
                {Object.entries(groupedByRegion).map(([region, destinations]) => (
                    <div key={region}>
                        <h3 className="text-white/50 text-[10px] uppercase tracking-wider mb-2 sticky top-0 bg-navy-deep/95 backdrop-blur py-1 z-10">{region}</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                            {destinations.map((dest) => {
                                const isSelected = value.includes(dest.name);
                                const isDisabled = !isSelected && value.length >= maxSelections;

                                return (
                                    <motion.button
                                        key={dest.name}
                                        onClick={() => !isDisabled && toggleDestination(dest.name)}
                                        disabled={isDisabled}
                                        className={cn(
                                            "p-2.5 rounded-lg border transition-all text-left flex items-center gap-2.5",
                                            isSelected
                                                ? "border-primary bg-primary/10 text-white"
                                                : isDisabled
                                                    ? "border-white/5 bg-white/5 text-white/30 cursor-not-allowed"
                                                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
                                        )}
                                        whileHover={!isDisabled ? { scale: 1.02 } : {}}
                                        whileTap={!isDisabled ? { scale: 0.98 } : {}}
                                    >
                                        <span className="text-lg">{dest.emoji}</span>
                                        <span className="flex-1 text-xs sm:text-sm font-medium truncate">{dest.name}</span>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-4 h-4 rounded-full bg-primary flex items-center justify-center ml-auto"
                                            >
                                                <Check className="w-2.5 h-2.5 text-navy-deep" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Step05DesiredDestinations;
