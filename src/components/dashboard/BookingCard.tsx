import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, CreditCard, Clock, Download, XCircle } from 'lucide-react';
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import type { BookingWithTrip } from '@/lib/supabase/bookings';

interface BookingCardProps {
    booking: BookingWithTrip;
    onCancel?: (id: string) => void;
    onViewDetails?: (id: string) => void;
}

export function BookingCard({ booking, onCancel, onViewDetails }: BookingCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-500/10 text-green-500 border-green-500/30';
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
            case 'cancelled':
                return 'bg-red-500/10 text-red-500 border-red-500/30';
            case 'completed':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
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

    const daysUntilTrip = booking.travel_start_date
        ? differenceInDays(new Date(booking.travel_start_date), new Date())
        : null;

    const showCountdown = daysUntilTrip !== null && daysUntilTrip > 0 && booking.status === 'confirmed';

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                    {/* Trip Image */}
                    {booking.trip?.image_url && (
                        <div
                            className="h-48 md:h-auto md:w-48 bg-cover bg-center"
                            style={{ backgroundImage: `url(${booking.trip.image_url})` }}
                        />
                    )}

                    {/* Booking Details */}
                    <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-semibold mb-1">
                                    {booking.trip?.name || 'Trip Booking'}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Ref: {booking.booking_reference}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className={getStatusColor(booking.status)}>
                                    {booking.status}
                                </Badge>
                                <Badge variant="secondary" className={getPaymentStatusColor(booking.payment_status)}>
                                    {booking.payment_status}
                                </Badge>
                            </div>
                        </div>

                        {/* Countdown */}
                        {showCountdown && (
                            <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                                <div className="flex items-center gap-2 text-primary">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-semibold">
                                        {daysUntilTrip} {daysUntilTrip === 1 ? 'day' : 'days'} until your trip!
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Trip Info Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Travel Dates</p>
                                    <p className="font-medium">
                                        {booking.travel_start_date && format(new Date(booking.travel_start_date), 'MMM dd')} -
                                        {booking.travel_end_date && format(new Date(booking.travel_end_date), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Travelers</p>
                                    <p className="font-medium">{booking.number_of_travelers} {booking.number_of_travelers === 1 ? 'person' : 'people'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Total Amount</p>
                                    <p className="font-medium">{booking.currency} {booking.total_amount?.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Paid Amount</p>
                                    <p className="font-medium">{booking.currency} {booking.paid_amount?.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Date */}
                        <p className="text-xs text-muted-foreground mb-4">
                            Booked {booking.booking_date && formatDistanceToNow(new Date(booking.booking_date), { addSuffix: true })}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                            {onViewDetails && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => onViewDetails(booking.id!)}
                                >
                                    View Details
                                </Button>
                            )}
                            {booking.status === 'confirmed' && (
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Invoice
                                </Button>
                            )}
                            {booking.status === 'pending' && onCancel && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => onCancel(booking.id!)}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel Booking
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
