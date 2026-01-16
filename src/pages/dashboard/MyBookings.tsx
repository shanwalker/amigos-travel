import { useBookings, useUpdateBookingStatus } from '@/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Plane,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  confirmed: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-red-500/10 text-red-500',
  completed: 'bg-blue-500/10 text-blue-500',
};

const MyBookings = () => {
  const { data: bookings = [], isLoading } = useBookings();
  const updateStatus = useUpdateBookingStatus();

  const handleCancel = async (id: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: 'cancelled' });
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been cancelled successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel booking.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">My Bookings</h1>
        <p className="text-muted-foreground mt-2">Manage your trip reservations</p>
      </div>

      {bookings.length === 0 ? (
        <Card className="bg-card/50 border-border/50">
          <CardContent className="py-12 text-center">
            <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start exploring and book your first adventure!
            </p>
            <Button 
              className="bg-primary text-primary-foreground"
              onClick={() => window.location.href = '/dashboard/trips'}
            >
              Browse Trips
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-card/50 border-border/50 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Trip Image */}
                  <div 
                    className="h-48 md:h-auto md:w-64 bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${booking.trip?.image_url || '/placeholder.svg'})` }}
                  />
                  
                  {/* Booking Details */}
                  <CardContent className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold text-foreground">
                            {booking.trip?.title}
                          </h3>
                          <Badge className={statusColors[booking.status]}>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {booking.trip?.destination}, {booking.trip?.country}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {booking.trip?.start_date && format(new Date(booking.trip.start_date), 'MMM dd, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {booking.trip?.duration_days} days
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {booking.num_travelers} travelers
                          </span>
                        </div>

                        <div className="pt-2">
                          <p className="text-lg font-bold text-primary">
                            ₹{booking.total_amount?.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="border-destructive text-destructive hover:bg-destructive/10"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">Cancel Booking?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  Are you sure you want to cancel this booking? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-background border-border">
                                  Keep Booking
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground"
                                  onClick={() => handleCancel(booking.id)}
                                >
                                  Yes, Cancel
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-4 p-3 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{booking.notes}</span>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
