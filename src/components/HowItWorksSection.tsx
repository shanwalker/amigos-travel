import { motion } from 'framer-motion';
import { ClipboardList, Sparkles, Plane } from 'lucide-react';
import { memo } from 'react';

const steps = [
    {
        number: '01',
        icon: ClipboardList,
        title: 'Tell Us About You',
        description: 'Take a 2-minute quiz to define your travel personality, pace, and comfort.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        number: '02',
        icon: Sparkles,
        title: 'We Find the Best Fit',
        description: 'Our logic matches you to a Group Trip, a Custom Itinerary, or a Surprise Journey.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        number: '03',
        icon: Plane,
        title: 'Travel Your Way',
        description: 'Decide whether to join like-minded travelers or embark on a bespoke solo adventure.',
        color: 'from-primary to-orange-500',
    },
];

export const HowItWorksSection = memo(() => {
    return (
        <section className="relative py-10 md:py-16 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }} />
            </div>

            <div className="relative z-10 container mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4"
                    >
                        Simple Process
                    </motion.span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto">
                        Three simple steps to discover your perfect travel experience
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="relative group"
                            >
                                {/* Connecting Line (hidden on mobile, shown on desktop between cards) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-1/2 z-0" />
                                )}

                                {/* Card */}
                                <div className="relative bg-card border border-border rounded-2xl p-8 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 h-full">
                                    {/* Number Badge */}
                                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground font-sans leading-relaxed">
                                        {step.description}
                                    </p>

                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Trust Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-center mt-16"
                >
                    <p className="text-lg font-semibold text-foreground mb-2">
                        Join over <span className="text-primary">10,000 Amigos</span> who have explored the world with us
                    </p>
                    <p className="text-sm text-muted-foreground font-sans">
                        🔒 We respect your privacy—your info is safe with us
                    </p>
                </motion.div>
            </div>
        </section>
    );
});

HowItWorksSection.displayName = 'HowItWorksSection';
