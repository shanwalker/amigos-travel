import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/hooks/useBookings';
import { useTrips } from '@/hooks/useTrips';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plane, Calendar, MapPin, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const DashboardHome = () => {
  const { user } = useAuth();
  const { data: bookings = [] } = useBookings();
  const { data: trips = [] } = useTrips();

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
  const completedTrips = bookings.filter(b => b.status === 'completed').length;

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Traveler';

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

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          title="Upcoming Trips"
          value={upcomingBookings.length}
          icon={<Plane className="h-6 w-6" />}
          description="Confirmed bookings"
        />
        <StatsCard
          title="Completed Trips"
          value={completedTrips}
          icon={<MapPin className="h-6 w-6" />}
          description="Adventures completed"
        />
        <StatsCard
          title="Available Trips"
          value={trips.length}
          icon={<Calendar className="h-6 w-6" />}
          description="Ready to explore"
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
