import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Booking } from '@/hooks/useBookings';
import { CalendarCheck, DollarSign, Clock, CheckCircle } from 'lucide-react';

interface BookingStatsProps {
    bookings: Booking[];
}

export const BookingStats = ({ bookings = [] }: BookingStatsProps) => {
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.payment_status === 'paid' ? b.total_amount : b.amount_paid), 0);
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card/50 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        Across {totalBookings} bookings
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                    <CalendarCheck className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalBookings}</div>
                    <p className="text-xs text-muted-foreground">
                        Total lifetime bookings
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingBookings}</div>
                    <p className="text-xs text-muted-foreground">
                        Require attention
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{confirmedBookings}</div>
                    <p className="text-xs text-muted-foreground">
                        Ready for departure
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
