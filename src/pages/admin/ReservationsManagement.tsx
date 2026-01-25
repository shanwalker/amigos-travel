import { useState } from 'react';
import { useReservations, useUpdateReservation } from '@/hooks/useReservations';
import { useTrips } from '@/hooks/useTrips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import type { TripReservation, Trip } from '@/integrations/supabase/database.types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Ticket, Search, Loader2, RefreshCw, Calendar, Users,
  CheckCircle, Clock, XCircle, DollarSign, TrendingUp, MapPin
} from 'lucide-react';

const ReservationsManagement = () => {
  const { data: reservations = [], isLoading, refetch } = useReservations();
  const { data: trips = [] } = useTrips();
  const updateReservation = useUpdateReservation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const pendingReservations = reservations.filter(r => r.status === 'pending');
  const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
  const cancelledReservations = reservations.filter(r => ['refunded', 'cancelled'].includes(r.status));

  // Get reservable trips with their reservation counts
  const reservableTrips = trips.filter(t => t.trip_type === 'group_reservable');
  const tripReservationMap = new Map<string, TripReservation[]>();
  reservations.forEach(r => {
    const existing = tripReservationMap.get(r.trip_id) || [];
    existing.push(r);
    tripReservationMap.set(r.trip_id, existing);
  });

  const handleStatusChange = async (reservation: TripReservation, newStatus: string) => {
    try {
      await updateReservation.mutateAsync({
        id: reservation.id,
        status: newStatus as any,
      });
      toast.success(`Reservation ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update reservation');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'refunded': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTrip = (tripId: string): Trip | undefined => trips.find(t => t.id === tripId);

  const ReservationCard = ({ reservation }: { reservation: TripReservation }) => {
    const trip = getTrip(reservation.trip_id);
    
    return (
      <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-all">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Ticket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm line-clamp-1">
                  {trip?.title || 'Unknown Trip'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(reservation.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(reservation.status)}>
              {reservation.status}
            </Badge>
          </div>

          {trip && (
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{trip.destination}, {trip.country}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Fee:</span>
                <span className="text-foreground">
                  ₹{trip.reservation_fee?.toLocaleString() || '999'}
                </span>
                {reservation.reservation_fee_paid && (
                  <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-500">
                    Paid
                  </Badge>
                )}
              </div>

              {reservation.preferred_dates && reservation.preferred_dates.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Preferred:</span>
                  <span className="text-foreground text-xs">
                    {reservation.preferred_dates.join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {reservation.status === 'pending' && (
              <>
                <Button 
                  size="sm" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusChange(reservation, 'confirmed')}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Confirm
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleStatusChange(reservation, 'cancelled')}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </>
            )}
            {reservation.status === 'confirmed' && (
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1"
                onClick={() => handleStatusChange(reservation, 'refunded')}
              >
                Refund
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const TripReservationCard = ({ trip }: { trip: Trip }) => {
    const tripReservations = tripReservationMap.get(trip.id) || [];
    const confirmedCount = tripReservations.filter(r => r.status === 'confirmed' || r.status === 'pending').length;
    const minRequired = trip.min_reservations || 10;
    const progress = Math.min((confirmedCount / minRequired) * 100, 100);
    const isReady = confirmedCount >= minRequired;

    return (
      <Card className={`bg-card/50 border-border/50 ${isReady ? 'border-green-500/50' : ''}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">{trip.title}</h3>
              <p className="text-sm text-muted-foreground">{trip.destination}, {trip.country}</p>
            </div>
            {isReady ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Ready to Confirm
              </Badge>
            ) : (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                Collecting
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reservations</span>
              <span className="font-medium text-foreground">
                {confirmedCount} / {minRequired} minimum
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Fee per person</span>
              <span className="text-foreground">₹{trip.reservation_fee?.toLocaleString() || '999'}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total collected</span>
              <span className="font-medium text-primary">
                ₹{(confirmedCount * (trip.reservation_fee || 999)).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Reservations</h1>
          <p className="text-muted-foreground mt-1">Manage trip reservations and thresholds</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingReservations.length}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{confirmedReservations.length}</p>
                <p className="text-xs text-muted-foreground">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{reservableTrips.length}</p>
                <p className="text-xs text-muted-foreground">Active Trips</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ₹{reservations
                    .filter(r => r.reservation_fee_paid)
                    .reduce((sum, r) => {
                      const trip = getTrip(r.trip_id);
                      return sum + (trip?.reservation_fee || 999);
                    }, 0)
                    .toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Collected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trip Progress Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Trip Reservation Progress</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservableTrips.map(trip => (
            <TripReservationCard key={trip.id} trip={trip} />
          ))}
          {reservableTrips.length === 0 && (
            <Card className="bg-card/50 border-border/50 col-span-full">
              <CardContent className="p-12 text-center">
                <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reservable trips available</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search reservations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background/50"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" />
            Pending ({pendingReservations.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Confirmed ({confirmedReservations.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="gap-2">
            <XCircle className="w-4 h-4" />
            Cancelled ({cancelledReservations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingReservations.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-12 text-center">
                <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending reservations</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingReservations.map(reservation => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {confirmedReservations.map(reservation => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cancelledReservations.map(reservation => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReservationsManagement;
