import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, MapPin, Calendar, Sparkles, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SurpriseTripRevealProps {
    destination: {
        name: string;
        country: string;
        imageUrl?: string;
        description?: string;
    };
    tripDates?: {
        start: string;
        end: string;
    };
    onComplete?: () => void;
}

export function SurpriseTripReveal({
    destination,
    tripDates,
    onComplete
}: SurpriseTripRevealProps) {
    const [scratchProgress, setScratchProgress] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isScratching, setIsScratching] = useState(false);

    // Initialize canvas for scratch effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctxRef.current = ctx;

        // Set canvas size
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2; // For retina
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);

        // Draw gold scratch layer with pattern
        const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
        gradient.addColorStop(0, '#FFB400');
        gradient.addColorStop(0.5, '#FFD700');
        gradient.addColorStop(1, '#FFA500');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Add sparkle pattern
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * rect.width;
            const y = Math.random() * rect.height;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 3 + 1, 0, Math.PI * 2);
            ctx.fill();
        }

        // Add text
        ctx.fillStyle = '#1a365d';
        ctx.font = 'bold 24px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎁 SCRATCH TO REVEAL', rect.width / 2, rect.height / 2 - 10);
        ctx.font = '14px Plus Jakarta Sans, sans-serif';
        ctx.fillText('Your surprise destination awaits!', rect.width / 2, rect.height / 2 + 20);

        // Set composite operation for scratch effect
        ctx.globalCompositeOperation = 'destination-out';
    }, []);

    // Handle scratch
    const handleScratch = (clientX: number, clientY: number) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Draw scratch circle
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Calculate progress
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let transparent = 0;
        for (let i = 3; i < imageData.data.length; i += 4) {
            if (imageData.data[i] === 0) transparent++;
        }
        const progress = (transparent / (imageData.data.length / 4)) * 100;
        setScratchProgress(progress);

        // Check if enough is scratched (40%+)
        if (progress > 40 && !isRevealed) {
            setIsRevealed(true);
            triggerCelebration();
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isScratching) return;
        handleScratch(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isScratching) return;
        const touch = e.touches[0];
        handleScratch(touch.clientX, touch.clientY);
    };

    const triggerCelebration = () => {
        // Multi-stage confetti
        const duration = 4000;
        const end = Date.now() + duration;

        const colors = ['#FFB400', '#FF6B35', '#FF3366', '#7C3AED', '#10B981'];

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 70,
                origin: { x: 0, y: 0.7 },
                colors,
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 70,
                origin: { x: 1, y: 0.7 },
                colors,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        // Initial burst
        confetti({
            particleCount: 100,
            spread: 100,
            origin: { x: 0.5, y: 0.5 },
            colors,
        });

        frame();

        // Callback after animation
        setTimeout(() => {
            onComplete?.();
        }, 3000);
    };

    return (
        <div className="relative w-full max-w-lg mx-auto">
            {/* Background - Destination Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-navy-deep to-[#0a1628]">
                {destination.imageUrl ? (
                    <img
                        src={destination.imageUrl}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
                        <span className="text-9xl">✈️</span>
                    </div>
                )}

                {/* Destination Overlay */}
                <AnimatePresence>
                    {isRevealed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6"
                        >
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <span className="text-white/60 text-sm">Your Surprise Destination</span>
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-1 font-jakarta">
                                    {destination.name}
                                </h2>
                                <p className="text-xl text-primary">{destination.country}</p>
                                {destination.description && (
                                    <p className="text-white/70 mt-3 text-sm">{destination.description}</p>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Scratch Overlay */}
                <canvas
                    ref={canvasRef}
                    onMouseDown={() => setIsScratching(true)}
                    onMouseUp={() => setIsScratching(false)}
                    onMouseLeave={() => setIsScratching(false)}
                    onMouseMove={handleMouseMove}
                    onTouchStart={() => setIsScratching(true)}
                    onTouchEnd={() => setIsScratching(false)}
                    onTouchMove={handleTouchMove}
                    className={`absolute inset-0 w-full h-full cursor-crosshair transition-opacity duration-500 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
                        }`}
                    style={{ touchAction: 'none' }}
                />
            </div>

            {/* Trip Dates (if revealed) */}
            <AnimatePresence>
                {isRevealed && tripDates && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-white/50 text-sm">Your Trip Dates</p>
                            <p className="text-white font-semibold">
                                {new Date(tripDates.start).toLocaleDateString('en-US', {
                                    month: 'long', day: 'numeric'
                                })} - {new Date(tripDates.end).toLocaleDateString('en-US', {
                                    month: 'long', day: 'numeric', year: 'numeric'
                                })}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Celebration Message */}
            <AnimatePresence>
                {isRevealed && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-6 text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-3">
                            <PartyPopper className="w-5 h-5 text-primary" />
                            <span className="text-primary font-medium">Surprise Revealed!</span>
                        </div>
                        <p className="text-white/60 text-sm">
                            Get ready for an unforgettable adventure. Your full itinerary is now available in your dashboard.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SurpriseTripReveal;
