import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AVOID_SUGGESTIONS } from '@/types/onboarding-quiz';
import { StepHeader } from '../StepTransition';

interface Step06Props {
    value: string[];
    onChange: (value: string[]) => void;
}

export function Step06PlacesToAvoid({ value, onChange }: Step06Props) {
    const [customInput, setCustomInput] = useState('');

    const toggleSuggestion = (item: string) => {
        if (value.includes(item)) {
            onChange(value.filter(v => v !== item));
        } else {
            onChange([...value, item]);
        }
    };

    const addCustom = () => {
        if (customInput.trim() && !value.includes(customInput.trim())) {
            onChange([...value, customInput.trim()]);
            setCustomInput('');
        }
    };

    const removeItem = (item: string) => {
        onChange(value.filter(v => v !== item));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCustom();
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <StepHeader
                title="Any places you want to avoid?"
                subtitle="Optional - Skip if you're open to anywhere"
                emoji="🚫"
            />

            {/* Selected Items */}
            {value.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-2 mb-6"
                >
                    {value.map(item => (
                        <motion.span
                            key={item}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-medium border border-red-500/30"
                        >
                            {item}
                            <button
                                onClick={() => removeItem(item)}
                                className="w-4 h-4 rounded-full bg-red-500/30 hover:bg-red-500 flex items-center justify-center transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </motion.span>
                    ))}
                </motion.div>
            )}

            {/* Custom Input */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a place or condition to avoid..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-primary focus:outline-none transition-all"
                />
                <motion.button
                    onClick={addCustom}
                    disabled={!customInput.trim()}
                    className={cn(
                        "px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
                        customInput.trim()
                            ? "bg-primary text-navy-deep hover:bg-primary/90"
                            : "bg-white/10 text-white/30 cursor-not-allowed"
                    )}
                    whileHover={customInput.trim() ? { scale: 1.05 } : {}}
                    whileTap={customInput.trim() ? { scale: 0.95 } : {}}
                >
                    <Plus className="w-4 h-4" />
                    Add
                </motion.button>
            </div>

            {/* Suggestions */}
            <div className="space-y-2">
                <p className="text-white/50 text-xs sm:text-sm">Quick adds:</p>
                <div className="flex flex-wrap gap-2">
                    {AVOID_SUGGESTIONS.map((suggestion) => {
                        const isSelected = value.includes(suggestion);
                        return (
                            <motion.button
                                key={suggestion}
                                onClick={() => toggleSuggestion(suggestion)}
                                className={cn(
                                    "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all border",
                                    isSelected
                                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                                        : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:border-white/20"
                                )}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isSelected ? '✓ ' : ''}{suggestion}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <p className="text-center text-white/40 text-xs mt-6">
                This step is optional. Continue to skip.
            </p>
        </div>
    );
}

export default Step06PlacesToAvoid;
