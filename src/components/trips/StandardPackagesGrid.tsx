import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStandardPackages } from '@/hooks/useTripsByType';
import { Package, MapPin, Clock, Star, ArrowRight, Loader2, Users } from 'lucide-react';

export const StandardPackagesGrid = () => {
  const { data: trips, isLoading } = useStandardPackages();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-muted/20">
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
    <section className="py-16 px-4 bg-gradient-to-b from-muted/20 to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <Badge className="mb-3 bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Package className="w-3 h-3 mr-1" />
              Ready-to-Book
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display text-foreground">
              Standard Packages
            </h2>
            <p className="text-muted-foreground mt-2">
              Pre-planned itineraries perfect for your own group
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard/trips')}>
            View All Packages
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trips.slice(0, 8).map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="overflow-hidden bg-card/80 border-border/50 hover:border-primary/50 transition-all duration-300 group cursor-pointer h-full"
                onClick={() => navigate(`/dashboard/trips/${trip.id}`)}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={trip.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Duration badge */}
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-white/20 text-white text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {trip.duration_days}D
                    </Badge>
                  </div>

                  {/* Location */}
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-center gap-1 text-white text-sm">
                      <MapPin className="w-3 h-3" />
                      {trip.destination}
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm group-hover:text-primary transition-colors">
                    {trip.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    {trip.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {trip.rating}
                      </span>
                    )}
                    {trip.category && (
                      <Badge variant="outline" className="text-xs capitalize px-2 py-0">
                        {trip.category}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-primary">
                        ₹{trip.price?.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">/person</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                      View
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StandardPackagesGrid;
