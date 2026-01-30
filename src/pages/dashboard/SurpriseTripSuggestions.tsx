import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMyMatchedTrips, MatchedTrip } from '@/hooks/useMatchedTrips';
import { useCreateBooking } from '@/hooks/useBookings';
import { useUpdateSurpriseRequest } from '@/hooks/useSurpriseRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  Check,
  Loader2,
  IndianRupee,
  ArrowRight,
  Gift,
  Zap,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const SurpriseTripSuggestions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useMyMatchedTrips(user?.id);
  const createBooking = useCreateBooking();
  const updateRequest = useUpdateSurpriseRequest();
  
  const [selectedTrip, setSelectedTrip] = useState<MatchedTrip | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const request = data?.request;
  const matchedTrips = data?.trips || [];

  const handleSelectTrip = (trip: MatchedTrip) => {
    setSelectedTrip(trip);
    setShowConfirmDialog(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedTrip || !user || !request) return;

    setIsBooking(true);
    try {
      // Create booking
      await createBooking.mutateAsync({
        trip_id: selectedTrip.id,
        number_of_travelers: 1,
        total_amount: selectedTrip.price || 0,
        special_requests: `Surprise trip selection based on questionnaire preferences`,
      });

      // Update surprise request status
      await updateRequest.mutateAsync({
        id: request.id,
        status: 'revealed',
      });

      toast.success('Trip booked successfully! 🎉', {
        description: `You've selected ${selectedTrip.title}. Check your bookings for details.`,
      });
      
      setShowConfirmDialog(false);
      navigate('/dashboard/bookings');
    } catch (error: any) {
      toast.error('Failed to book trip', {
        description: error.message || 'Please try again later',
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Finding your perfect trips...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <Gift className="h-16 w-16 text-primary/50 mx-auto mb-4" />
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          No Surprise Trip Request Found
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Start by telling us your travel preferences and we'll suggest amazing trips just for you!
        </p>
        <Link to="/signup/surprise">
          <Button className="bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4 mr-2" />
            Start Surprise Trip Quiz
          </Button>
        </Link>
      </div>
    );
  }

  // If trip already assigned
  if (request.assigned_trip_id) {
    return (
      <div className="text-center py-12">
        <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Your Surprise Trip is Confirmed!
        </h2>
        <p className="text-muted-foreground mb-6">
          You've already selected a trip. View your booking details below.
        </p>
        <Link to={`/dashboard/trips/${request.assigned_trip_id}`}>
          <Button className="bg-primary text-primary-foreground">
            View Your Trip <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Your Surprise Trip Suggestions
            </h1>
            <p className="text-muted-foreground">
              Based on your preferences, here are trips we think you'll love!
            </p>
          </div>
        </div>
      </motion.div>

      {/* User Preferences Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Your Travel Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Budget Range</p>
                <p className="font-medium text-foreground flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" />
                  {request.budget_min.toLocaleString()} - {request.budget_max.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Interests</p>
                <div className="flex flex-wrap gap-1">
                  {request.interests_data?.interests?.slice(0, 3).map((interest) => (
                    <Badge key={interest} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Activities</p>
                <div className="flex flex-wrap gap-1">
                  {request.interests_data?.activities?.slice(0, 3).map((activity) => (
                    <Badge key={activity} variant="outline" className="text-xs">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Travel Style</p>
                <Badge className="bg-primary/10 text-primary border-0">
                  {request.interests_data?.travel_style || 'Any'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Matched Trips */}
      {matchedTrips.length === 0 ? (
        <Card className="bg-card/50 border-border/50">
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No matching trips available right now
            </h3>
            <p className="text-muted-foreground mb-4">
              We're working on finding the perfect trip for you. Check back soon!
            </p>
            <Link to="/dashboard/trips">
              <Button variant="outline">Browse All Trips</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matchedTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <TripSuggestionCard 
                trip={trip} 
                rank={index + 1}
                onSelect={() => handleSelectTrip(trip)} 
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Confirm Your Selection
            </DialogTitle>
            <DialogDescription>
              You're about to book this trip as your surprise adventure!
            </DialogDescription>
          </DialogHeader>

          {selectedTrip && (
            <div className="space-y-4">
              <div 
                className="h-40 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedTrip.image_url || '/placeholder.svg'})` }}
              />
              <div>
                <h3 className="text-lg font-semibold text-foreground">{selectedTrip.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedTrip.destination}, {selectedTrip.country}
                </p>
              </div>
              <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-2xl font-bold text-primary flex items-center">
                  <IndianRupee className="h-5 w-5" />
                  {selectedTrip.price?.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
              disabled={isBooking}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmBooking}
              disabled={isBooking}
              className="bg-primary text-primary-foreground"
            >
              {isBooking ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirm Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Individual trip suggestion card
const TripSuggestionCard = ({ 
  trip, 
  rank,
  onSelect 
}: { 
  trip: MatchedTrip; 
  rank: number;
  onSelect: () => void;
}) => {
  const isTopMatch = rank === 1;

  return (
    <Card className={`bg-card/50 border-border/50 overflow-hidden group hover:border-primary/50 transition-all duration-300 ${isTopMatch ? 'ring-2 ring-primary/50' : ''}`}>
      {/* Image */}
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${trip.image_url || '/placeholder.svg'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        
        {/* Match Score Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${isTopMatch ? 'bg-primary' : 'bg-card/90'} text-${isTopMatch ? 'primary-foreground' : 'foreground'} backdrop-blur-sm`}>
            {isTopMatch && <Zap className="h-3 w-3 mr-1" />}
            {trip.matchScore}% Match
          </Badge>
        </div>

        {/* Rank Badge */}
        {rank <= 3 && (
          <div className="absolute top-3 right-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              rank === 1 ? 'bg-yellow-500 text-yellow-950' :
              rank === 2 ? 'bg-gray-300 text-gray-800' :
              'bg-amber-600 text-amber-50'
            }`}>
              #{rank}
            </div>
          </div>
        )}

        {/* Spots Left */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline" className="bg-card/80 backdrop-blur-sm">
            {trip.spots_left} spots left
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Title & Location */}
        <div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {trip.title}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {trip.destination}, {trip.country}
          </p>
        </div>

        {/* Match Reasons */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Why we picked this:</p>
          <div className="flex flex-wrap gap-1">
            {trip.matchReasons.slice(0, 3).map((reason, i) => (
              <Badge key={i} variant="outline" className="text-xs bg-primary/5">
                {reason}
              </Badge>
            ))}
          </div>
        </div>

        {/* Match Score Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Match Score</span>
            <span className="text-primary font-medium">{trip.matchScore}%</span>
          </div>
          <Progress value={trip.matchScore} className="h-2" />
        </div>

        {/* Trip Details */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {trip.duration_days} days
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {trip.total_spots} travelers
          </span>
          {trip.rating && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-primary fill-primary" />
              {trip.rating}
            </span>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-2xl font-bold text-primary flex items-center">
              <IndianRupee className="h-4 w-4" />
              {trip.price?.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">per person</p>
          </div>
          <Button 
            onClick={onSelect}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Select Trip
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurpriseTripSuggestions;
