import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, MapPin, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
import { MagneticButton } from './ui/animations';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Redesigned Hero Section following the Master Directive
 * Mission: Profile-First Travel Companion
 * Tone: Playful & Inviting
 * Visual: High-Motion Premium
 */
export const HeroSectionRedesign = memo(() => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleQuizClick = () => {
        navigate('/start-quiz');
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating orbs */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl"
                        style={{
                            width: `${200 + i * 50}px`,
                            height: `${200 + i * 50}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            x: [0, Math.random() * 100 - 50, 0],
                            y: [0, Math.random() * 100 - 50, 0],
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Hero Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Pre-headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Ready for an adventure?</span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
                    >
                        Travel Your Way.
                        <br />
                        <span className="text-gradient bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                            We'll Be Your Travel Amigo.
                        </span>
                    </motion.h1>

                    {/* Sub-heading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-xl md:text-2xl text-white/90 font-sans mb-4 max-w-3xl mx-auto"
                    >
                        Solo, couple, family, friends, or group—tell us how you like to travel,
                        and we'll help you plan it the best way.
                    </motion.p>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-lg text-white/80 font-sans mb-10 max-w-2xl mx-auto"
                    >
                        Just answer a few quick questions—share your travel style, interests, and budget—and
                        we'll find your ideal trip!
                    </motion.p>

                    {/* Primary CTA */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mb-16"
                    >
                        <MagneticButton
                            onClick={handleQuizClick}
                            className="group relative px-8 py-5 text-lg font-semibold bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 text-white rounded-2xl shadow-2xl shadow-primary/50 transition-all duration-300 hover:scale-105 animate-glow-pulse"
                        >
                            <span className="flex items-center gap-3">
                                <span>👉 Take the Travel Quiz</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </MagneticButton>
                        <p className="text-sm text-white/50 mt-4 font-sans">
                            Just 2 minutes • Get personalized recommendations
                        </p>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.0 }}
                        className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
                    >
                        <div className="flex items-center gap-2 text-white/70">
                            <Users className="w-5 h-5 text-primary" />
                            <span className="text-sm font-sans">
                                <span className="font-bold text-white">10,000+</span> Amigos
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                            <MapPin className="w-5 h-5 text-primary" />
                            <span className="text-sm font-sans">
                                <span className="font-bold text-white">50+</span> Countries
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                            <Heart className="w-5 h-5 text-primary" />
                            <span className="text-sm font-sans">
                                <span className="font-bold text-white">4.9/5</span> Rating
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-xs text-white/50 font-sans">Scroll to explore</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </motion.div>
            </motion.div>
        </section>
    );
});

HeroSectionRedesign.displayName = 'HeroSectionRedesign';
