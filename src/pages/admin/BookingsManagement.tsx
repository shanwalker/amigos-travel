import { useState } from 'react';
import { useBookings, Booking } from '@/hooks/useBookings';
import { BookingStats } from '@/components/admin/bookings/BookingStats';
import { BookingDetails } from '@/components/admin/bookings/BookingDetails';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Search, Filter, Loader2, Eye, MoreHorizontal, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingsManagement = () => {
  const { data: bookings, isLoading } = useBookings();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredBookings = bookings?.filter(booking => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      booking.customer_name?.toLowerCase().includes(query) ||
      booking.customer_email?.toLowerCase().includes(query) ||
      booking.trip?.title?.toLowerCase().includes(query) ||
      booking.id.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default'; // primary color
      case 'completed': return 'default'; // simplified
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'outline';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-500';
      case 'partial': return 'text-amber-500';
      case 'pending': return 'text-muted-foreground';
      case 'failed': return 'text-red-500';
      case 'refunded': return 'text-gray-500';
      default: return 'text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground mt-2">Manage trip reservations and payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <BookingStats bookings={bookings || []} />

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or trip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Customer</TableHead>
                  <TableHead>Trip Details</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings?.map((booking) => (
                    <TableRow key={booking.id} className="border-border/50 hover:bg-muted/50 cursor-pointer" onClick={() => handleViewDetails(booking)}>
                      <TableCell>
                        <div className="font-medium">{booking.customer_name || 'Guest User'}</div>
                        <div className="text-xs text-muted-foreground">{booking.customer_email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.trip?.title || 'Unknown Trip'}</div>
                        <div className="text-xs text-muted-foreground">{booking.guest_count} guest(s)</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {booking.trip_date ? format(new Date(booking.trip_date.start_date), 'MMM d, yyyy') : 'TBD'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(booking.status) as any}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className={`text-sm font-medium capitalize ${getPaymentStatusColor(booking.payment_status)}`}>
                            {booking.payment_status}
                          </span>
                          {booking.payment_status !== 'paid' && booking.amount_paid > 0 && (
                            <span className="text-xs text-muted-foreground">{Math.round((booking.amount_paid / booking.total_amount) * 100)}% paid</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{booking.total_amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleViewDetails(booking); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Booking Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] p-0">
          {selectedBooking && selectedBooking.id && (
            /* Key is essential to force re-mounting and thus re-fetching hooks inside Details */
            <BookingDetails
              key={selectedBooking.id}
              booking={selectedBooking}
              onClose={() => setIsDetailsOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BookingsManagement;
