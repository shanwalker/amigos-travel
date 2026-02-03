import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, PartyPopper } from 'lucide-react';
import { TravelVibe, VIBE_OPTIONS } from '@/types/onboarding-quiz';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface QuizCompleteProps {
    onClose: () => void;
    vibeType: TravelVibe | null;
}

export function QuizComplete({ onClose, vibeType }: QuizCompleteProps) {
    const navigate = useNavigate();
    const vibeDetails = VIBE_OPTIONS.find(v => v.value === vibeType);

    // Trigger confetti on mount
    useEffect(() => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.8 },
                colors: ['#FFB400', '#FF6B35', '#FF3366'],
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.8 },
                colors: ['#FFB400', '#FF6B35', '#FF3366'],
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, []);

    const handleGoToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-navy-deep via-navy-deep to-[#0a1628] flex items-center justify-center p-6"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="max-w-lg w-full text-center"
            >
                {/* Celebration Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-r from-primary to-orange-500 flex items-center justify-center shadow-2xl shadow-primary/30"
                >
                    <PartyPopper className="w-12 h-12 text-navy-deep" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-4 font-jakarta"
                >
                    You're All Set! 🎉
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/60 text-lg mb-8"
                >
                    Your travel profile has been saved successfully.
                </motion.p>

                {/* Vibe Card */}
                {vibeDetails && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className={`p-6 rounded-2xl bg-gradient-to-br ${vibeDetails.color} bg-opacity-20 border border-white/10 mb-8`}
                        style={{ background: `linear-gradient(135deg, rgba(255,180,0,0.1), rgba(255,100,50,0.1))` }}
                    >
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-5xl">{vibeDetails.emoji}</span>
                            <div className="text-left">
                                <p className="text-white/50 text-sm">Your Travel Vibe</p>
                                <h3 className="text-2xl font-bold text-primary">{vibeDetails.label}</h3>
                                <p className="text-white/60 text-sm">{vibeDetails.description}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* What's Next */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
                >
                    <h3 className="font-bold text-white mb-3">What happens next?</h3>
                    <ul className="text-left space-y-3">
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Sparkles className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-white/70 text-sm">
                                Our travel experts will analyze your preferences
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Sparkles className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-white/70 text-sm">
                                You'll receive personalized trip suggestions in your dashboard
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Sparkles className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-white/70 text-sm">
                                If you chose "Surprise Me", watch for clues leading up to your trip!
                            </span>
                        </li>
                    </ul>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={handleGoToDashboard}
                    className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-primary via-orange-500 to-red-500 text-navy-deep hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span>Go to My Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                </motion.button>
            </motion.div>
        </motion.div>
    );
}

export default QuizComplete;
