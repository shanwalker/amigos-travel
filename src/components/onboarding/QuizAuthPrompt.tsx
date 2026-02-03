import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface QuizAuthPromptProps {
    onSuccess: () => void;
    onClose: () => void;
}

export function QuizAuthPrompt({ onSuccess, onClose }: QuizAuthPromptProps) {
    const { signIn, signUp } = useAuth();
    const [mode, setMode] = useState<'login' | 'signup'>('signup');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'signup') {
                const { error } = await signUp(email, password, fullName);
                if (error) {
                    setError(error.message);
                    return;
                }
            } else {
                const { error } = await signIn(email, password);
                if (error) {
                    setError(error.message);
                    return;
                }
            }

            // Success - trigger migration
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-gradient-to-b from-[#0d1f3c] to-navy-deep rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="relative p-6 pb-4 text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4 text-white/60" />
                    </button>

                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-primary to-orange-500 flex items-center justify-center">
                        <span className="text-3xl">🎒</span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2 font-jakarta">
                        {mode === 'signup' ? 'Save Your Trip Preferences' : 'Welcome Back!'}
                    </h2>
                    <p className="text-white/50 text-sm">
                        {mode === 'signup'
                            ? 'Create an account to save your quiz and get personalized recommendations.'
                            : 'Sign in to continue with your trip planning.'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
                    {mode === 'signup' && (
                        <div>
                            <label className="text-white/60 text-sm mb-2 block">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Your name"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-primary focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-white/60 text-sm mb-2 block">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-primary focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-white/60 text-sm mb-2 block">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-primary focus:outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                            loading
                                ? "bg-white/10 text-white/30 cursor-not-allowed"
                                : "bg-gradient-to-r from-primary via-orange-500 to-red-500 text-navy-deep hover:shadow-lg hover:shadow-primary/30"
                        )}
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <span>{mode === 'signup' ? 'Create Account & Save' : 'Sign In'}</span>
                        )}
                    </motion.button>

                    {/* Toggle Mode */}
                    <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                            className="text-white/50 hover:text-white text-sm transition-colors"
                        >
                            {mode === 'signup'
                                ? 'Already have an account? Sign in'
                                : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default QuizAuthPrompt;
