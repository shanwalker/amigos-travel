import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Plane, Minimize2, Loader2, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import { model } from '@/lib/gemini';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import React from 'react';
import { createChatSession, logChatMessage, getUserIP } from '@/lib/supabase/chat-logging';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: Date;
}

export const AmigoChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatSession, setChatSession] = useState<any>(null); // Store chat session state locally
    const [dbSessionId, setDbSessionId] = useState<string | null>(null); // Database session ID
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();
    const location = useLocation();

    // Initialize chat session on mount or when reopened if needed
    useEffect(() => {
        if (!chatSession) {
            try {
                const session = model.startChat({
                    history: [],
                });
                setChatSession(session);
            } catch (error) {
                console.error("Failed to start chat session:", error);
            }
        }
    }, [chatSession]);

    // Create database session when chat is opened (only for authenticated users)
    useEffect(() => {
        const initSession = async () => {
            if (isOpen && !dbSessionId && user?.id) {
                try {
                    const ip = await getUserIP();
                    const result = await createChatSession(
                        user.id,
                        ip,
                        navigator.userAgent,
                        window.location.href
                    );

                    if (result.success && result.sessionId) {
                        setDbSessionId(result.sessionId);
                    }
                } catch (e) {
                    console.warn('Chat session logging skipped:', e);
                }
            }
        };

        initSession();
    }, [isOpen, user]);

    // Update session page URL when location changes
    useEffect(() => {
        // Ideally we would update the session with the new URL, 
        // but for now we just track the entry URL in createChatSession
    }, [location]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300); // Small delay for animation
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim() || !chatSession) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Log user message
        if (dbSessionId) {
            logChatMessage(dbSessionId, 'user', userMessage.content);
        }

        try {
            const result = await chatSession.sendMessage(userMessage.content);
            const response = await result.response;
            const text = response.text();

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: text,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);

            // Log bot message
            if (dbSessionId) {
                logChatMessage(dbSessionId, 'assistant', text);
            }
        } catch (error: any) {
            console.error('Chat error:', error);
            const errStr = error?.message || error?.toString() || '';
            if (errStr.includes('API key') || errStr.includes('403') || errStr.includes('400')) {
                console.error("🚨 Gemini API Key issue — key may be missing or invalid.");
            }

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: "Oops! I hit a bit of turbulence. ✈️ Can you try asking that again?",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);

            // Log error message
            if (dbSessionId) {
                logChatMessage(dbSessionId, 'system', `Error: ${error}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] sm:w-[380px] h-[500px] bg-background/80 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl overflow-hidden flex flex-col pointer-events-auto ring-1 ring-black/5"
                        style={{
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(255, 255, 255, 0.1) inset"
                        }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-primary/90 to-primary text-primary-foreground flex justify-between items-center shadow-md">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Amigo AI</h3>
                                    <p className="text-xs text-primary-foreground/80">Your local travel expert 🌴</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                            >
                                <Minimize2 className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background/50 to-background/80">
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground text-sm mt-8 space-y-2">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Plane className="w-6 h-6 text-primary" />
                                    </div>
                                    <p>Hey Amigo! 👋</p>
                                    <p>I'm Amigo AI—your travel buddy. Ask me about trips, destinations, or how TravelAmigo works!</p>
                                </div>
                            )}
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex w-full mb-2",
                                        msg.role === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                                            msg.role === 'user'
                                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                : "bg-muted/80 backdrop-blur-sm border border-border rounded-tl-sm"
                                        )}
                                    >
                                        <Markdown
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />,
                                                a: ({ node, ...props }) => <a className="underline font-medium" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                                li: ({ node, ...props }) => <li className="mb-0.5" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </Markdown>
                                        <span className="text-[10px] opacity-70 block text-right mt-1">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start w-full">
                                    <div className="bg-muted/80 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2 border border-border shadow-sm">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        <span className="text-xs text-muted-foreground">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t bg-background/95 backdrop-blur-md">
                            <div className="flex items-center gap-2 relative">
                                <Input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about trips, destinations..."
                                    className="pr-10 rounded-full border-gray-200 focus-visible:ring-primary shadow-sm bg-white/50"
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    size="icon"
                                    className={cn(
                                        "absolute right-1 w-8 h-8 rounded-full transition-all duration-200 shadow-sm",
                                        input.trim() ? "opacity-100 scale-100" : "opacity-70 scale-90"
                                    )}
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="text-center mt-2">
                                <p className="text-[10px] text-muted-foreground/60">
                                    AI can make mistakes. Check important info.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow pointer-events-auto ring-2 ring-white/20"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                        >
                            <Sparkles className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};
