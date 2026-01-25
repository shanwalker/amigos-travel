import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/hooks/useBookings';
import { useTrips } from '@/hooks/useTrips';
import { useSurpriseRequests } from '@/hooks/useSurpriseRequests';
import { useCustomRequests } from '@/hooks/useCustomRequests';
import { useReservations } from '@/hooks/useReservations';
import { useProfile } from '@/hooks/useProfile';
import { useRealtimeUserRequests } from '@/hooks/useRealtimeRequests';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plane, Calendar, MapPin, TrendingUp, Clock, ArrowRight, Sparkles, Wand2, Users, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { getTripTypeLabel } from '@/lib/signupSession';

const DashboardHome = () => {
  const { user } = useAuth();
  
  // Enable real-time updates for user requests
  useRealtimeUserRequests(user?.id);
  const { data: bookings = [] } = useBookings();
  const { data: trips = [] } = useTrips();
  const { data: profile, isLoading: loadingProfile } = useProfile(user?.id || '');
  
  // Fetch user's requests
  const { data: allSurpriseRequests = [] } = useSurpriseRequests();
  const { data: allCustomRequests = [] } = useCustomRequests();
  const { data: allReservations = [] } = useReservations();

  // Filter to current user's requests
  const surpriseRequests = allSurpriseRequests.filter(r => r.user_id === user?.id);
  const customRequests = allCustomRequests.filter(r => r.user_id === user?.id);
  const reservations = allReservations.filter(r => r.user_id === user?.id);

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
  const completedTrips = bookings.filter(b => b.status === 'completed').length;
  const totalRequests = surpriseRequests.length + customRequests.length + reservations.length;
  const pendingRequests = [
    ...surpriseRequests.filter(r => r.status === 'pending'),
    ...customRequests.filter(r => r.status === 'pending'),
    ...reservations.filter(r => r.status === 'pending'),
  ];

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Traveler';
  const signupTripType = profile?.travel_preferences?.signup_trip_type;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'matched': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'planning': return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      case 'confirmed': return 'bg-green-500/10 text-green-500 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const getRequestIcon = (type: string) => {
    switch (type) {
      case 'surprise': return <Sparkles className="h-5 w-5 text-purple-400" />;
      case 'custom': return <Wand2 className="h-5 w-5 text-orange-400" />;
      case 'reservation': return <Users className="h-5 w-5 text-blue-400" />;
      default: return <Plane className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-display font-bold text-foreground">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Ready for your next adventure? Here's your travel overview.
        </p>
      </motion.div>

      {/* Your Journey Started Card */}
      {signupTripType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="p-3 rounded-xl bg-primary/20">
                {signupTripType === 'surprise' && <Sparkles className="h-6 w-6 text-primary" />}
                {signupTripType === 'custom' && <Wand2 className="h-6 w-6 text-primary" />}
                {signupTripType === 'group' && <Users className="h-6 w-6 text-primary" />}
                {signupTripType === 'standard' && <MapPin className="h-6 w-6 text-primary" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Your Journey Started With</p>
                <p className="text-lg font-semibold text-foreground">
                  {getTripTypeLabel(signupTripType as any)}
                </p>
              </div>
              {signupTripType === 'surprise' ? (
                <Link to="/dashboard/surprise-suggestions">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Sparkles className="mr-2 h-4 w-4" />
                    View Suggested Trips <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard/requests">
                  <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                    View Status <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Request Status Widget */}
      {pendingRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                Active Requests
              </CardTitle>
              <CardDescription>Your trip requests being processed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {surpriseRequests.filter(r => r.status !== 'completed').slice(0, 2).map((req) => (
                <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                  {getRequestIcon('surprise')}
                  <div className="flex-1">
                    <p className="font-medium text-sm">Surprise Trip Request</p>
                    <p className="text-xs text-muted-foreground">
                      Budget: ₹{req.budget_min?.toLocaleString()} - ₹{req.budget_max?.toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(req.status)}>
                    {req.status}
                  </Badge>
                </div>
              ))}
              {customRequests.filter(r => r.status !== 'completed').slice(0, 2).map((req) => (
                <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                  {getRequestIcon('custom')}
                  <div className="flex-1">
                    <p className="font-medium text-sm">Custom Trip Request</p>
                    <p className="text-xs text-muted-foreground">
                      {req.num_travelers} traveler(s)
                    </p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(req.status)}>
                    {req.status}
                  </Badge>
                </div>
              ))}
              {reservations.filter(r => r.status !== 'confirmed').slice(0, 2).map((req) => (
                <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                  {getRequestIcon('reservation')}
                  <div className="flex-1">
                    <p className="font-medium text-sm">Group Trip Reservation</p>
                    <p className="text-xs text-muted-foreground">
                      {req.reservation_fee_paid ? 'Fee Paid' : 'Payment Pending'}
                    </p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(req.status)}>
                    {req.status}
                  </Badge>
                </div>
              ))}
              <Link to="/dashboard/requests" className="block">
                <Button variant="ghost" size="sm" className="w-full text-primary">
                  View All Requests <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          title="Upcoming Trips"
          value={upcomingBookings.length}
          icon={<Plane className="h-6 w-6" />}
          description="Confirmed bookings"
        />
        <StatsCard
          title="Active Requests"
          value={totalRequests}
          icon={<Clock className="h-6 w-6" />}
          description="Trip requests submitted"
        />
        <StatsCard
          title="Completed Trips"
          value={completedTrips}
          icon={<CheckCircle2 className="h-6 w-6" />}
          description="Adventures completed"
        />
        <StatsCard
          title="Travel Points"
          value="1,250"
          icon={<TrendingUp className="h-6 w-6" />}
          description="Reward points earned"
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Trips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Upcoming Trips</CardTitle>
                <CardDescription>Your confirmed adventures</CardDescription>
              </div>
              <Link to="/dashboard/bookings">
                <Button variant="ghost" size="sm" className="text-primary">
                  View all <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.slice(0, 3).map((booking) => (
                    <div 
                      key={booking.id} 
                      className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/30"
                    >
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Plane className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{booking.trip?.title}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {booking.trip?.start_date && format(new Date(booking.trip.start_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-0">
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming trips</p>
                  <Link to="/dashboard/trips">
                    <Button className="mt-4 bg-primary text-primary-foreground">
                      Browse Trips
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Featured Trips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Featured Trips</CardTitle>
                <CardDescription>Popular destinations</CardDescription>
              </div>
              <Link to="/dashboard/trips">
                <Button variant="ghost" size="sm" className="text-primary">
                  View all <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trips.slice(0, 3).map((trip) => (
                  <div 
                    key={trip.id} 
                    className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    <div 
                      className="h-12 w-12 rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${trip.image_url || '/placeholder.svg'})` }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{trip.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {trip.destination}, {trip.country}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">₹{trip.price?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{trip.duration_days} days</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
