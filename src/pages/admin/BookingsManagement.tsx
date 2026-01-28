import { useState } from 'react';
import { useAllBookings, useUpdateBookingStatus, type Booking } from '@/hooks/useBookings';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const BookingsManagement = () => {
  const { data: bookings, isLoading } = useAllBookings();
  const updateStatus = useUpdateBookingStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBookings = bookings?.filter((booking: any) => {
    const matchesSearch = 
      booking.trip?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    try {
      await updateStatus.mutateAsync({ id: bookingId, status: newStatus });
      toast({ title: 'Success', description: 'Booking status updated!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
      completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    return variants[status] || 'bg-gray-500/20 text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Bookings Management</h1>
        <p className="text-muted-foreground mt-2">View and manage all customer bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by trip or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
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
                  <TableHead>Trip</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Travelers</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Booked On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings?.map((booking: any) => (
                  <TableRow key={booking.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {booking.trip?.image_url && (
                          <img 
                            src={booking.trip.image_url} 
                            alt={booking.trip.title} 
                            className="h-10 w-10 rounded-lg object-cover" 
                          />
                        )}
                        <div>
                          <p className="font-medium">{booking.trip?.title || 'Unknown Trip'}</p>
                          <p className="text-sm text-muted-foreground">{booking.trip?.destination}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.profile?.full_name || 'No name'}</p>
                        <p className="text-sm text-muted-foreground">{booking.profile?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{booking.num_travelers}</TableCell>
                    <TableCell>₹{booking.total_amount?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        booking.payment_status === 'paid' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }>
                        {booking.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadge(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(booking.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={booking.status} 
                        onValueChange={(value) => handleStatusChange(booking.id, value as 'pending' | 'confirmed' | 'cancelled' | 'completed')}
                      >
                        <SelectTrigger className="w-[130px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredBookings?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No bookings found
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => {
          const count = bookings?.filter((b: any) => b.status === status).length || 0;
          return (
            <Card key={status} className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground capitalize">{status}</p>
                <p className="text-2xl font-bold text-foreground">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BookingsManagement;
