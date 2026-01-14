import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { z } from 'zod';

const MAX_MESSAGE_LENGTH = 500;

const messageSchema = z.string().trim().min(1, "Message cannot be empty").max(MAX_MESSAGE_LENGTH, `Message must be less than ${MAX_MESSAGE_LENGTH} characters`);

export const ChatFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Enforce max length at input level
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setMessage(value);
      setError(null);
    }
  };

  const handleSubmit = () => {
    try {
      const validatedMessage = messageSchema.parse(message);
      // Process validated message (for future backend integration)
      console.log('Valid message:', validatedMessage);
      setMessage('');
      setError(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || 'Invalid message');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <>
      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl pulse-dot"
        style={{ boxShadow: '0 0 30px hsla(42, 100%, 50%, 0.4)' }}
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {/* Tooltip */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          className="fixed bottom-8 right-24 z-40 glass-card px-4 py-2 rounded-lg hidden md:block"
        >
          <p className="text-sm text-foreground font-inter whitespace-nowrap">
            Ask <span className="text-primary font-semibold">Amigo AI</span> ✨
          </p>
          {/* Arrow */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-[var(--glass-bg)] rotate-45 border-r border-t border-[var(--glass-border-color)]" />
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-md glass-card overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-xl">🤖</span>
                </div>
                <div>
                  <h4 className="font-jakarta font-bold text-foreground">Amigo AI</h4>
                  <p className="text-xs text-muted-foreground font-inter">Always here to help</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="h-80 p-6 overflow-y-auto">
              {/* Welcome Message */}
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🤖</span>
                </div>
                <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-md max-w-[80%]">
                  <p className="text-sm text-foreground font-inter">
                    Hey there! 👋 I'm your travel buddy. Ask me anything about destinations, trips, or how Travel Amigo works!
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-4">
                {['Best trips in Jan', 'Solo travel tips', 'Group sizes'].map((action) => (
                  <button 
                    key={action}
                    className="px-3 py-1.5 rounded-full border border-foreground/20 text-xs font-inter text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-foreground/10">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    maxLength={MAX_MESSAGE_LENGTH}
                    className="flex-1 bg-navy-medium/50 border border-foreground/10 rounded-xl py-3 px-4 text-foreground font-inter placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={!message.trim()}
                    className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
                {error && (
                  <p className="text-xs text-red-400 font-inter">{error}</p>
                )}
                <p className="text-xs text-muted-foreground font-inter text-right">
                  {message.length}/{MAX_MESSAGE_LENGTH}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
