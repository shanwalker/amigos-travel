import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, MapPin, Calendar, Users, Heart } from 'lucide-react';
import { z } from 'zod';

const MAX_MESSAGE_LENGTH = 500;
const messageSchema = z.string().trim().min(1, "Message cannot be empty").max(MAX_MESSAGE_LENGTH);

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// AI Knowledge Base about Travel Amigo
const travelKnowledge = {
  greetings: [
    "Hey there, fellow traveler! 👋 I'm Amigo AI, your personal travel companion. How can I help you discover your next adventure?",
    "Welcome to Travel Amigo! ✨ I'm here to help you find the perfect group travel experience. What are you curious about?",
  ],
  destinations: {
    keywords: ['destination', 'where', 'place', 'country', 'city', 'thailand', 'bali', 'vietnam'],
    response: "We offer amazing group trips to incredible destinations! 🌏 Our popular spots include Thailand (Bangkok, Phuket, Chiang Mai), Bali, Vietnam, and many more. Each trip is carefully curated for the perfect mix of adventure, culture, and relaxation. Which destination interests you?"
  },
  groupTravel: {
    keywords: ['group', 'people', 'solo', 'alone', 'friends', 'tribe'],
    response: "Travel Amigo is all about group travel with a twist! 🎉 You'll join a fixed group of like-minded travelers (usually 15-20 people) for the entire trip. It's perfect for solo travelers who want to make friends, or groups looking for new experiences. You'll vote democratically on activities and create memories together!"
  },
  pricing: {
    keywords: ['price', 'cost', 'expensive', 'cheap', 'budget', 'pay', 'money'],
    response: "Our trips are designed to be affordable without compromising on quality! 💰 Prices typically range from ₹35,000 to ₹65,000 depending on the destination and duration. This includes accommodation, most meals, activities, and local transport. We also offer early bird discounts and group deals!"
  },
  booking: {
    keywords: ['book', 'reserve', 'join', 'sign up', 'register'],
    response: "Booking is super easy! 🎫 Just browse our trips, pick your favorite, and click 'Book Now'. You can pay in installments, and we'll handle all the planning. Once booked, you'll get access to your trip's WhatsApp group to meet your travel tribe before departure!"
  },
  concept: {
    keywords: ['concept', 'amigo way', 'philosophy', 'different', 'unique', 'special'],
    response: "The Amigo Way is what makes us special! ✨ We believe in: 1) Fixed Groups - travel with the same awesome people throughout, 2) Democratic Voting - the group decides on activities together, 3) Open Tribe - welcoming, inclusive community, 4) Authentic Experiences - real connections, not just tourist traps!"
  },
  safety: {
    keywords: ['safe', 'safety', 'secure', 'trust', 'reliable'],
    response: "Your safety is our top priority! 🛡️ All trips include experienced trip leaders, 24/7 support, comprehensive travel insurance options, and carefully vetted accommodations. We also have emergency protocols and maintain constant communication with all travelers."
  },
  duration: {
    keywords: ['long', 'days', 'duration', 'week', 'time'],
    response: "Our trips typically range from 5 to 14 days! ⏰ Most popular are our 7-day adventures - perfect for a week-long escape. We design itineraries to give you the best mix of exploration and relaxation, so you return refreshed, not exhausted!"
  },
  activities: {
    keywords: ['activity', 'activities', 'do', 'adventure', 'experience', 'fun'],
    response: "Every trip is packed with amazing experiences! 🎨 From temple visits and street food tours to beach parties and hiking adventures. The best part? Your group votes on optional activities, so you're always doing what interests you most. It's your trip, your way!"
  }
};

const getAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();

  // Check each knowledge category
  for (const [key, value] of Object.entries(travelKnowledge)) {
    if (key === 'greetings') continue;

    const category = value as { keywords: string[]; response: string };
    if (category.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return category.response;
    }
  }

  // Default response
  return "That's a great question! 🤔 I'd love to help you with that. You can also check out our website for more details, or feel free to ask me about our destinations, group travel concept, pricing, or booking process. What would you like to know more about?";
};

export const ChatFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message when chat opens
      const welcomeMessage: Message = {
        id: 'welcome',
        text: travelKnowledge.greetings[Math.floor(Math.random() * travelKnowledge.greetings.length)],
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || message.trim();

    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI thinking and respond
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        text: getAIResponse(messageText),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay
  };

  const quickActions = [
    { icon: MapPin, text: 'Best destinations', query: 'What are your best destinations?' },
    { icon: Calendar, text: 'Trip duration', query: 'How long are the trips?' },
    { icon: Users, text: 'Group travel', query: 'Tell me about group travel' },
    { icon: Heart, text: 'The Amigo Way', query: 'What is the Amigo Way?' },
  ];

  return (
    <>
      {/* Enhanced FAB Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-primary via-orange-500 to-red-500 text-white flex items-center justify-center shadow-2xl"
        style={{ boxShadow: '0 0 40px rgba(255, 180, 0, 0.6), 0 0 80px rgba(255, 180, 0, 0.3)' }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <Sparkles className="w-7 h-7" />
        </motion.div>
      </motion.button>

      {/* Enhanced Tooltip */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          className="fixed bottom-8 right-24 z-40 px-5 py-3 rounded-2xl hidden md:block bg-gradient-to-r from-primary/90 to-orange-500/90 backdrop-blur-xl border border-white/20 shadow-xl"
        >
          <p className="text-sm text-white font-semibold whitespace-nowrap flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Ask Amigo AI
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ✨
            </motion.span>
          </p>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-3 h-3 bg-gradient-to-br from-primary to-orange-500 rotate-45" />
        </motion.div>
      )}

      {/* Enhanced Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-md rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(10, 37, 64, 0.95) 0%, rgba(15, 45, 75, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Header with Gradient */}
            <div className="relative px-6 py-4 bg-gradient-to-r from-primary/20 to-orange-500/20 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-navy-deep" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white flex items-center gap-2">
                      Amigo AI
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/30 text-primary-foreground">Beta</span>
                    </h4>
                    <p className="text-xs text-gray-300">Your AI Travel Companion</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 p-4 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {!msg.isUser && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl max-w-[80%] ${msg.isUser
                          ? 'bg-gradient-to-r from-primary to-orange-500 text-white rounded-tr-md'
                          : 'bg-white/10 backdrop-blur-sm text-white rounded-tl-md border border-white/10'
                        }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white/10 backdrop-blur-sm border border-white/10">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 rounded-full bg-white/60"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 rounded-full bg-white/60"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 rounded-full bg-white/60"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions - Only show initially */}
              {messages.length <= 1 && !isTyping && (
                <div className="mt-6 space-y-2">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Quick Questions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <motion.button
                        key={action.text}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickAction(action.query)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all text-left"
                      >
                        <action.icon className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-xs text-white">{action.text}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex items-end gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about travel..."
                  maxLength={MAX_MESSAGE_LENGTH}
                  className="flex-1 bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSendMessage()}
                  disabled={!message.trim() || isTyping}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by Amigo AI • {message.length}/{MAX_MESSAGE_LENGTH}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 180, 0, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 180, 0, 0.7);
        }
      `}</style>
    </>
  );
};
