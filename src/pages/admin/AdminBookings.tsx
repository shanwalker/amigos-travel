import { useState } from 'react';
import { useAllBookings, useBookingStats, useAdminUpdateBookingStatus, useAdminUpdatePaymentStatus } from '@/hooks/useAdminData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, DollarSign, Users, TrendingUp, Download, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { exportBookingsToCSV } from '@/lib/supabase/bookings';
import { useToast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function AdminBookings() {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const { data: bookings = [], isLoading } = useAllBookings(
        statusFilter !== 'all' ? { status: statusFilter as any } : undefined
    );
    const { data: stats } = useBookingStats();
    const updateStatus = useAdminUpdateBookingStatus();
    const updatePayment = useAdminUpdatePaymentStatus();
    const { toast } = useToast();

    const handleExport = async () => {
        try {
            const csv = await exportBookingsToCSV();
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            toast({
                title: 'Export Successful',
                description: 'Bookings have been exported to CSV',
            });
        } catch (error) {
            toast({
                title: 'Export Failed',
                description: 'Failed to export bookings',
                variant: 'destructive',
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-500/10 text-green-500';
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-500';
            case 'cancelled':
                return 'bg-red-500/10 text-red-500';
            case 'completed':
                return 'bg-blue-500/10 text-blue-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-500/10 text-green-500';
            case 'partial':
                return 'bg-yellow-500/10 text-yellow-500';
            case 'pending':
                return 'bg-orange-500/10 text-orange-500';
            case 'refunded':
                return 'bg-blue-500/10 text-blue-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-96">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Booking Management</h1>
                    <p className="text-muted-foreground">Manage all trip bookings and payments</p>
                </div>
                <Button onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export to CSV
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total || 0}</div>
                        <p className="text-xs text-muted-foreground">All time bookings</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats?.total_revenue.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">Total earnings</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats?.pending_payments.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">Awaiting payment</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.confirmed || 0}</div>
                        <p className="text-xs text-muted-foreground">Confirmed trips</p>
                    </CardContent>
                </Card>
            </div>

            {/* Bookings Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Bookings</CardTitle>
                            <CardDescription>Manage and track all customer bookings</CardDescription>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold">{booking.trip?.name}</h3>
                                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                                        <Badge className={getPaymentStatusColor(booking.payment_status)}>{booking.payment_status}</Badge>
                                    </div>
                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                        <span>Ref: {booking.booking_reference}</span>
                                        <span>User: {booking.user?.email}</span>
                                        <span>{booking.number_of_travelers} travelers</span>
                                        <span>₹{booking.total_amount?.toLocaleString()}</span>
                                        <span>{booking.booking_date && format(new Date(booking.booking_date), 'MMM dd, yyyy')}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {booking.status === 'pending' && (
                                        <Button
                                            size="sm"
                                            onClick={() => updateStatus.mutate({ id: booking.id!, status: 'confirmed' })}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Confirm
                                        </Button>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateStatus.mutate({ id: booking.id!, status: 'completed' })}
                                        >
                                            Complete
                                        </Button>
                                    )}
                                    {booking.payment_status === 'pending' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updatePayment.mutate({
                                                id: booking.id!,
                                                status: 'paid',
                                                amount: booking.total_amount
                                            })}
                                        >
                                            Mark Paid
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
