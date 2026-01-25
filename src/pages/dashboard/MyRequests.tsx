import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSurpriseRequests } from '@/hooks/useSurpriseRequests';
import { useCustomRequests } from '@/hooks/useCustomRequests';
import { useReservations } from '@/hooks/useReservations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Compass, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Calendar,
  IndianRupee,
  MapPin,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const getStatusBadge = (status: string) => {
  const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: <Clock className="h-3 w-3" /> },
    matched: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: <CheckCircle className="h-3 w-3" /> },
    planning: { bg: 'bg-purple-500/10', text: 'text-purple-500', icon: <Sparkles className="h-3 w-3" /> },
    confirmed: { bg: 'bg-green-500/10', text: 'text-green-500', icon: <CheckCircle className="h-3 w-3" /> },
    completed: { bg: 'bg-gray-500/10', text: 'text-gray-500', icon: <CheckCircle className="h-3 w-3" /> },
    cancelled: { bg: 'bg-red-500/10', text: 'text-red-500', icon: <AlertCircle className="h-3 w-3" /> },
  };
  const style = styles[status] || styles.pending;
  
  return (
    <Badge className={`${style.bg} ${style.text} border-0 flex items-center gap-1`}>
      {style.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const MyRequests = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: surpriseRequests = [], isLoading: loadingSurprise } = useSurpriseRequests();
  const { data: customRequests = [], isLoading: loadingCustom } = useCustomRequests();
  const { data: reservations = [], isLoading: loadingReservations } = useReservations();

  // Filter requests for current user
  const userSurpriseRequests = surpriseRequests.filter(r => r.user_id === user?.id);
  const userCustomRequests = customRequests.filter(r => r.user_id === user?.id);
  const userReservations = reservations.filter(r => r.user_id === user?.id);

  const isLoading = loadingSurprise || loadingCustom || loadingReservations;
  const totalRequests = userSurpriseRequests.length + userCustomRequests.length + userReservations.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        <h1 className="text-3xl font-display font-bold text-foreground">My Requests</h1>
        <p className="text-muted-foreground mt-2">
          Track your trip requests and reservations
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4"
      >
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{userSurpriseRequests.length}</p>
              <p className="text-sm text-muted-foreground">Surprise Trips</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <Compass className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{userCustomRequests.length}</p>
              <p className="text-sm text-muted-foreground">Custom Trips</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{userReservations.length}</p>
              <p className="text-sm text-muted-foreground">Group Reservations</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalRequests}</p>
              <p className="text-sm text-muted-foreground">Total Requests</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Requests Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-card/50 border border-border/50">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="surprise">Surprise Trips</TabsTrigger>
            <TabsTrigger value="custom">Custom Trips</TabsTrigger>
            <TabsTrigger value="group">Group Trips</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {/* All Requests */}
            <TabsContent value="all" className="space-y-4">
              {totalRequests === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {userSurpriseRequests.map((request) => (
                    <SurpriseRequestCard key={request.id} request={request} />
                  ))}
                  {userCustomRequests.map((request) => (
                    <CustomRequestCard key={request.id} request={request} />
                  ))}
                  {userReservations.map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                  ))}
                </>
              )}
            </TabsContent>

            {/* Surprise Trips */}
            <TabsContent value="surprise" className="space-y-4">
              {userSurpriseRequests.length === 0 ? (
                <EmptyState type="surprise" />
              ) : (
                userSurpriseRequests.map((request) => (
                  <SurpriseRequestCard key={request.id} request={request} />
                ))
              )}
            </TabsContent>

            {/* Custom Trips */}
            <TabsContent value="custom" className="space-y-4">
              {userCustomRequests.length === 0 ? (
                <EmptyState type="custom" />
              ) : (
                userCustomRequests.map((request) => (
                  <CustomRequestCard key={request.id} request={request} />
                ))
              )}
            </TabsContent>

            {/* Group Trips */}
            <TabsContent value="group" className="space-y-4">
              {userReservations.length === 0 ? (
                <EmptyState type="group" />
              ) : (
                userReservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))
              )}
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
};

const SurpriseRequestCard = ({ request }: { request: any }) => (
  <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Sparkles className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <CardTitle className="text-lg">Surprise Trip Request</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="h-3 w-3" />
              Submitted {format(new Date(request.created_at), 'MMM d, yyyy')}
            </CardDescription>
          </div>
        </div>
        {getStatusBadge(request.status)}
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Budget Range</p>
          <p className="text-sm font-medium text-foreground flex items-center gap-1">
            <IndianRupee className="h-3 w-3" />
            {request.budget_min?.toLocaleString()} - {request.budget_max?.toLocaleString()}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Interests</p>
          <div className="flex flex-wrap gap-1">
            {request.interests_data?.interests?.slice(0, 3).map((interest: string) => (
              <Badge key={interest} variant="outline" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Dates</p>
          <p className="text-sm text-foreground">
            {request.flexible_dates ? 'Flexible' : request.preferred_dates || 'Not specified'}
          </p>
        </div>
      </div>
      {request.assigned_trip_id && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <Link to={`/dashboard/trips/${request.assigned_trip_id}`}>
            <Button size="sm" className="bg-primary text-primary-foreground">
              View Assigned Trip <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </CardContent>
  </Card>
);

const CustomRequestCard = ({ request }: { request: any }) => (
  <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Compass className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <CardTitle className="text-lg">Custom Trip Request</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="h-3 w-3" />
              Submitted {format(new Date(request.created_at), 'MMM d, yyyy')}
            </CardDescription>
          </div>
        </div>
        {getStatusBadge(request.status)}
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Budget Range</p>
          <p className="text-sm font-medium text-foreground flex items-center gap-1">
            <IndianRupee className="h-3 w-3" />
            {request.budget_min?.toLocaleString()} - {request.budget_max?.toLocaleString()}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Travelers</p>
          <p className="text-sm text-foreground flex items-center gap-1">
            <Users className="h-3 w-3" />
            {request.num_travelers} {request.num_travelers === 1 ? 'person' : 'people'}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Activities</p>
          <div className="flex flex-wrap gap-1">
            {request.requirements?.activities?.slice(0, 3).map((activity: string) => (
              <Badge key={activity} variant="outline" className="text-xs">
                {activity}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      {request.assigned_trip_id && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <Link to={`/dashboard/trips/${request.assigned_trip_id}`}>
            <Button size="sm" className="bg-primary text-primary-foreground">
              View Your Custom Trip <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </CardContent>
  </Card>
);

const ReservationCard = ({ reservation }: { reservation: any }) => (
  <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <CardTitle className="text-lg">Group Trip Reservation</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="h-3 w-3" />
              Reserved {format(new Date(reservation.created_at), 'MMM d, yyyy')}
            </CardDescription>
          </div>
        </div>
        {getStatusBadge(reservation.status)}
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Trip</p>
          <p className="text-sm font-medium text-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {reservation.trip?.title || 'Trip details pending'}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Payment Status</p>
          <Badge variant={reservation.reservation_fee_paid ? 'default' : 'outline'} className="text-xs">
            {reservation.reservation_fee_paid ? 'Fee Paid' : 'Payment Pending'}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Preferred Dates</p>
          <p className="text-sm text-foreground">
            {reservation.preferred_dates?.length > 0 
              ? reservation.preferred_dates.join(', ') 
              : 'Flexible'}
          </p>
        </div>
      </div>
      {reservation.trip_id && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <Link to={`/dashboard/trips/${reservation.trip_id}`}>
            <Button size="sm" className="bg-primary text-primary-foreground">
              View Trip Details <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </CardContent>
  </Card>
);

const EmptyState = ({ type }: { type?: string }) => {
  const getContent = () => {
    switch (type) {
      case 'surprise':
        return {
          icon: <Sparkles className="h-12 w-12 text-purple-500/50" />,
          title: 'No surprise trip requests',
          description: 'Let us plan a mystery adventure for you!',
          link: '/signup/surprise',
          buttonText: 'Request Surprise Trip',
        };
      case 'custom':
        return {
          icon: <Compass className="h-12 w-12 text-orange-500/50" />,
          title: 'No custom trip requests',
          description: 'Design your perfect itinerary with our experts',
          link: '/signup/custom',
          buttonText: 'Plan Custom Trip',
        };
      case 'group':
        return {
          icon: <Users className="h-12 w-12 text-blue-500/50" />,
          title: 'No group reservations',
          description: 'Join a curated group experience',
          link: '/dashboard/trips',
          buttonText: 'Browse Group Trips',
        };
      default:
        return {
          icon: <MapPin className="h-12 w-12 text-primary/50" />,
          title: 'No trip requests yet',
          description: 'Start planning your next adventure',
          link: '/get-started',
          buttonText: 'Get Started',
        };
    }
  };

  const content = getContent();

  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="py-12 text-center">
        <div className="mx-auto mb-4">{content.icon}</div>
        <h3 className="text-lg font-medium text-foreground mb-2">{content.title}</h3>
        <p className="text-muted-foreground mb-6">{content.description}</p>
        <Link to={content.link}>
          <Button className="bg-primary text-primary-foreground">
            {content.buttonText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default MyRequests;
