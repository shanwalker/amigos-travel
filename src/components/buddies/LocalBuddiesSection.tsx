import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useVerifiedBuddies } from '@/hooks/useLocalBuddies';
import { 
  Users, MapPin, Star, ArrowRight, Globe, 
  Car, CheckCircle2, Loader2, Sparkles
} from 'lucide-react';

export const LocalBuddiesSection = () => {
  const { data: buddies, isLoading } = useVerifiedBuddies();
  const navigate = useNavigate();

  // Show only first 4 verified buddies
  const featuredBuddies = buddies?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              <Users className="w-3 h-3 mr-1" />
              Local Buddies
            </Badge>

            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
              Travel With a Local Friend
            </h2>

            <p className="text-lg text-muted-foreground mb-6">
              Our verified Local Buddies are passionate locals who'll show you the 
              hidden gems, best street food, and authentic experiences that tourists never find.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: '🎯', text: 'Matched to your interests & travel style' },
                { icon: '✅', text: 'Verified & reviewed by our team' },
                { icon: '🗣️', text: 'Multi-lingual guides available' },
                { icon: '🚗', text: 'Many have their own transport' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-muted-foreground">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => navigate('/become-a-buddy')}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Sparkles className="w-5 h-5" />
                Become a Buddy
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/surprise-trip')}
              >
                Get Matched
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>

          {/* Right - Buddy Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {featuredBuddies.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {featuredBuddies.map((buddy, index) => (
                  <motion.div
                    key={buddy.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${buddy.id}`} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {buddy.city.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-foreground text-sm">Local Buddy</span>
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {buddy.city}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {buddy.languages?.slice(0, 2).map(lang => (
                        <Badge key={lang} variant="outline" className="text-[10px] px-1.5 py-0">
                          {lang}
                        </Badge>
                      ))}
                      {buddy.has_vehicle && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-green-500/30 text-green-500">
                          <Car className="w-2 h-2 mr-0.5" />
                          {buddy.vehicle_type}
                        </Badge>
                      )}
                    </div>

                    {buddy.rating && buddy.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium">{buddy.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">
                          ({buddy.total_trips} trips)
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              // Placeholder when no verified buddies exist
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-foreground text-sm">Coming Soon</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {['Bangkok', 'Bali', 'Goa', 'Hanoi'][index]}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        English
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        Local
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Decorative elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-primary/20 blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocalBuddiesSection;
