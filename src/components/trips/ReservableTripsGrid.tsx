import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useReservableTripsWithCount } from '@/hooks/useTripsByType';
import { ReserveTripModal } from './ReserveTripModal';
import type { Trip } from '@/integrations/supabase/database.types';
import { Users, MapPin, Ticket, ArrowRight, Loader2, Clock } from 'lucide-react';

export const ReservableTripsGrid = () => {
  const { data: trips, isLoading } = useReservableTripsWithCount();
  const navigate = useNavigate();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

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
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-3 bg-amber-500/20 text-amber-400 border-amber-500/30">
            <Ticket className="w-3 h-3 mr-1" />
            Reserve Your Spot
          </Badge>
          <h2 className="text-3xl md:text-4xl font-display text-foreground mb-3">
            Explore Destinations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Reserve your spot for ₹999. Once enough travelers join, the trip is confirmed!
            Full refund if the trip doesn't confirm.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.slice(0, 6).map((trip, index) => {
            const progressPercent = trip.min_reservations 
              ? (trip.reservation_count / trip.min_reservations) * 100 
              : 0;
            const spotsNeeded = trip.min_reservations 
              ? Math.max(0, trip.min_reservations - trip.reservation_count)
              : 0;

            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden bg-card/80 border-border/50 hover:border-primary/50 transition-all duration-300 group cursor-pointer h-full"
                  onClick={() => navigate(`/dashboard/trips/${trip.id}`)}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={trip.image_url || 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600'}
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Country badge */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-white/20 text-white">
                        <MapPin className="w-3 h-3 mr-1" />
                        {trip.country}
                      </Badge>
                    </div>

                    {/* Reservation fee */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary text-primary-foreground border-0">
                        Reserve: ₹{trip.reservation_fee?.toLocaleString() || '999'}
                      </Badge>
                    </div>

                    {/* Destination name overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-display text-xl text-white mb-1">
                        {trip.destination}
                      </h3>
                      <p className="text-sm text-white/80">{trip.duration_days} days adventure</p>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {trip.reservation_count} interested
                        </span>
                        <span className="text-primary font-medium">
                          {spotsNeeded > 0 ? `${spotsNeeded} more to confirm` : 'Almost there!'}
                        </span>
                      </div>
                      <Progress value={Math.min(progressPercent, 100)} className="h-2" />
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Starting from</span>
                        <div className="text-2xl font-bold text-foreground">
                          ₹{trip.price?.toLocaleString() || 'TBD'}
                        </div>
                      </div>
                      {trip.category && (
                        <Badge variant="outline" className="capitalize">
                          {trip.category}
                        </Badge>
                      )}
                    </div>

                    {/* CTA */}
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTrip(trip);
                      }}
                    >
                      <Ticket className="w-4 h-4" />
                      Reserve for ₹{trip.reservation_fee || 999}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" />
                      Full refund if trip doesn't confirm
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* View All */}
        {trips.length > 6 && (
          <div className="text-center mt-10">
            <Button variant="outline" size="lg" onClick={() => navigate('/dashboard/trips')}>
              Explore All Destinations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Reservation Modal */}
        {selectedTrip && (
          <ReserveTripModal
            trip={selectedTrip}
            isOpen={!!selectedTrip}
            onClose={() => setSelectedTrip(null)}
          />
        )}
      </div>
    </section>
  );
};

export default ReservableTripsGrid;
