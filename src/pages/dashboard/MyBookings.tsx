import { useState } from 'react';
import { useUserBookings, useCancelBooking } from '@/hooks/useBookings';
import { BookingCard } from '@/components/dashboard/BookingCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const MyBookings = () => {
  const { data: bookings = [], isLoading } = useUserBookings();
  const cancelBooking = useCancelBooking();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const handleCancelClick = (id: string) => {
    setSelectedBookingId(id);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (selectedBookingId) {
      cancelBooking.mutate({ id: selectedBookingId, reason: cancelReason || 'User requested cancellation' });
      setCancelDialogOpen(false);
      setSelectedBookingId(null);
      setCancelReason('');
    }
  };

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

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
        <p className="text-muted-foreground mt-2">Manage your trip reservations and view booking history</p>
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
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed ({completedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Cancelled ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {upcomingBookings.length === 0 ? (
              <Card className="bg-card/50 border-border/50">
                <CardContent className="py-8 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No upcoming bookings</p>
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <BookingCard
                    booking={booking}
                    onCancel={handleCancelClick}
                    onViewDetails={(id) => console.log('View details:', id)}
                  />
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {completedBookings.length === 0 ? (
              <Card className="bg-card/50 border-border/50">
                <CardContent className="py-8 text-center">
                  <CheckCircle2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No completed trips yet</p>
                </CardContent>
              </Card>
            ) : (
              completedBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <BookingCard
                    booking={booking}
                    onViewDetails={(id) => console.log('View details:', id)}
                  />
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4 mt-6">
            {cancelledBookings.length === 0 ? (
              <Card className="bg-card/50 border-border/50">
                <CardContent className="py-8 text-center">
                  <XCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No cancelled bookings</p>
                </CardContent>
              </Card>
            ) : (
              cancelledBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <BookingCard
                    booking={booking}
                    onViewDetails={(id) => console.log('View details:', id)}
                  />
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
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
              onClick={handleCancelConfirm}
            >
              Yes, Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyBookings;
