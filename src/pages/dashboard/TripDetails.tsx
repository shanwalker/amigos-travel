import { useParams, useNavigate } from 'react-router-dom';
import { useTripWithItinerary } from '@/hooks/useTrips';
import { useCreateBooking } from '@/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Clock, 
  ArrowLeft,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useTripWithItinerary(id || '');
  const createBooking = useCreateBooking();
  
  const [numTravelers, setNumTravelers] = useState(1);
  const [notes, setNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { trip, itinerary } = data;
  const totalAmount = (trip.price || 0) * numTravelers;

  const handleBooking = async () => {
    setIsBooking(true);
    try {
      await createBooking.mutateAsync({
        trip_id: trip.id,
        number_of_travelers: numTravelers,
        total_amount: totalAmount,
        special_requests: notes || undefined,
      });
      toast({
        title: 'Booking Successful!',
        description: 'Your booking has been submitted. We will confirm it shortly.',
      });
      navigate('/dashboard/bookings');
    } catch (error: any) {
      toast({
        title: 'Booking Failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Trips
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trip Info */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="h-72 rounded-xl bg-cover bg-center relative overflow-hidden"
              style={{ backgroundImage: `url(${trip.image_url || '/placeholder.svg'})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <Badge className="bg-primary/90 text-primary-foreground mb-2">
                  {trip.spots_left} spots left
                </Badge>
                <h1 className="text-3xl font-display font-bold text-foreground">
                  {trip.title}
                </h1>
                <p className="text-muted-foreground flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4" />
                  {trip.destination}, {trip.country}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Trip Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold text-foreground">{trip.duration_days} days</p>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Group Size</p>
                    <p className="font-semibold text-foreground">{trip.total_spots} max</p>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-semibold text-foreground">
                      {trip.start_date ? format(new Date(trip.start_date), 'MMM dd, yyyy') : 'TBD'}
                    </p>
                  </div>
                  {trip.rating && (
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <Star className="h-6 w-6 text-primary fill-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="font-semibold text-foreground">{trip.rating}/5</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    {trip.description || 'Experience an unforgettable journey to one of the most beautiful destinations in the world.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Itinerary */}
          {itinerary.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Itinerary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {itinerary.map((item, index) => (
                      <div 
                        key={item.id}
                        className="flex gap-4 p-4 bg-background/50 rounded-lg"
                      >
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-primary">D{item.day_number}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Booking Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card className="bg-card/50 border-border/50 sticky top-6">
            <CardHeader>
              <CardTitle className="text-foreground">Book This Trip</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-primary">₹{trip.price?.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">per person</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelers" className="text-foreground">Number of Travelers</Label>
                <Input
                  id="travelers"
                  type="number"
                  min={1}
                  max={trip.spots_left}
                  value={numTravelers}
                  onChange={(e) => setNumTravelers(parseInt(e.target.value) || 1)}
                  className="bg-background/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-foreground">Special Requests (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any dietary requirements, accessibility needs, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-background/50 border-border"
                />
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleBooking}
                disabled={isBooking || trip.spots_left === 0}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : trip.spots_left === 0 ? (
                  'Sold Out'
                ) : (
                  'Book Now'
                )}
              </Button>

              <div className="space-y-2 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Free cancellation up to 7 days before
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Best price guarantee
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Small group experience
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TripDetails;
