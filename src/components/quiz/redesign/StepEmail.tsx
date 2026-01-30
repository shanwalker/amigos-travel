import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Mail, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StepEmailProps {
    email: string;
    name: string;
    onUpdate: (field: string, value: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export const StepEmail = ({
    email,
    name,
    onUpdate,
    onSubmit,
    isSubmitting
}: StepEmailProps) => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) onSubmit();
    };

    return (
        <div className="w-full h-full flex flex-col justify-center max-h-[85vh] px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm md:max-w-md mx-auto p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden"
            >
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 hover:bg-primary/30 blur-[60px] transition-all rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/20 hover:bg-secondary/30 blur-[50px] transition-all rounded-full pointer-events-none" />

                <div className="text-center mb-6 md:mb-8 relative z-10">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary shadow-inner ring-1 ring-white/10">
                        <Sparkles className="w-6 h-6 md:w-8 md:h-8 animate-pulse" />
                    </div>

                    <h1 className="font-serif text-2xl md:text-3xl font-bold mb-1">
                        Your Trip is Ready
                    </h1>
                    <p className="text-muted-foreground text-xs md:text-sm px-4">
                        We've crafted a custom itinerary just for you. Where should we send it?
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    <div className="space-y-1.5">
                        <Input
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => onUpdate('name', e.target.value)}
                            className="h-12 rounded-xl bg-background/40 border-white/10 text-base px-4 focus-visible:ring-primary/50 transition-all hover:bg-background/60"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => onUpdate('email', e.target.value)}
                            className="h-12 rounded-xl bg-background/40 border-white/10 text-base px-4 focus-visible:ring-primary/50 transition-all hover:bg-background/60"
                            required
                        />
                    </div>

                    <Button
                        size="lg"
                        type="submit"
                        disabled={!email || isSubmitting}
                        className={cn(
                            "w-full h-12 rounded-xl text-base font-semibold mt-2 shadow-lg shadow-primary/20",
                            "bg-gradient-to-r from-primary to-primary/80 hover:brightness-110 transition-all"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Finalizing...
                            </>
                        ) : (
                            <>
                                Reveal My Itinerary
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>

                    <p className="text-[10px] text-center text-muted-foreground/60 pt-2">
                        By continuing, you agree to our Terms & Privacy Policy.
                    </p>
                </form>
            </motion.div>
        </div>
    );
};
