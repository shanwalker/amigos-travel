import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFeaturedTrips } from '@/hooks/useTripsByType';
import { ChevronLeft, ChevronRight, Calendar, Users, Star, MapPin, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export const FeaturedTripsCarousel = () => {
  const { data: trips, isLoading } = useFeaturedTrips();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (!trips?.length) return null;

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-transparent via-card/30 to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-3 bg-green-500/20 text-green-400 border-green-500/30">
              Confirmed Departures
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display text-foreground">
              Featured Group Trips
            </h2>
            <p className="text-muted-foreground mt-2">
              Join fellow travelers on these confirmed adventures
            </p>
          </motion.div>

          <div className="hidden md:flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll('left')}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll('right')}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="snap-start shrink-0 w-[350px]"
            >
              <Card className="overflow-hidden bg-card/80 border-border/50 hover:border-primary/50 transition-all duration-300 group cursor-pointer h-full"
                onClick={() => navigate(`/dashboard/trips/${trip.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={trip.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-green-500 text-white border-0">
                      Confirmed
                    </Badge>
                    {trip.is_featured && (
                      <Badge className="bg-primary text-primary-foreground border-0">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Spots left */}
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-white/20 text-white">
                      <Users className="w-3 h-3 mr-1" />
                      {trip.spots_left} spots left
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {trip.destination}, {trip.country}
                  </div>

                  <h3 className="font-display text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {trip.title}
                  </h3>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {trip.start_date ? format(new Date(trip.start_date), 'MMM d, yyyy') : 'Flexible'}
                    </div>
                    <span className="text-muted-foreground">{trip.duration_days} days</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        ₹{trip.price?.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">/person</span>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => navigate('/dashboard/trips')}>
            View All Group Trips
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTripsCarousel;
