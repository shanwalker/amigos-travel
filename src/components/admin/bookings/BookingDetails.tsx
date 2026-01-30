import { useState } from 'react';
import { Booking, useBookingPayments, useUpdateBooking, useAddPayment } from '@/hooks/useBookings';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { User, Calendar, CreditCard, Mail, Phone, MapPin, CheckCircle, XCircle, Clock, Loader2, Plus, DollarSign } from 'lucide-react';
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

interface BookingDetailsProps {
    booking: Booking;
    onClose?: () => void;
}

export const BookingDetails = ({ booking, onClose }: BookingDetailsProps) => {
    const { data: payments, isLoading: isPaymentsLoading } = useBookingPayments(booking.id);
    const updateBooking = useUpdateBooking();
    const addPayment = useAddPayment();

    const [isAddPaymentSearchOpen, setIsAddPaymentSearchOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

    const handleStatusUpdate = (status: any) => {
        updateBooking.mutate({ id: booking.id, updates: { status } });
    };

    const handlePaymentStatusUpdate = (status: any) => {
        updateBooking.mutate({ id: booking.id, updates: { payment_status: status } });
    };

    const handleAddPayment = async () => {
        if (!paymentAmount) return;

        await addPayment.mutateAsync({
            booking_id: booking.id,
            amount: parseFloat(paymentAmount),
            currency: booking.currency,
            method: paymentMethod,
            status: 'success',
            payment_date: new Date().toISOString()
        });

        setIsAddPaymentSearchOpen(false);
        setPaymentAmount('');
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            confirmed: 'bg-green-500/10 text-green-500 border-green-500/20',
            completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
            refunded: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        };
        return (
            <Badge variant="outline" className={styles[status] || styles.pending}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <SheetHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <SheetTitle className="text-xl">Booking #{booking.id.slice(0, 8)}</SheetTitle>
                        <SheetDescription>
                            Created on {format(new Date(booking.created_at), 'PPP')}
                        </SheetDescription>
                    </div>
                    <StatusBadge status={booking.status} />
                </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto py-6 space-y-8">
                {/* Trip Info */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Trip Details
                    </h3>
                    <div className="bg-muted/30 p-4 rounded-lg border space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Trip:</span>
                            <span className="font-medium">{booking.trip?.title || 'Unknown Trip'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Destination:</span>
                            <span className="font-medium">{booking.trip?.destination}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Dates:</span>
                            <span className="font-medium">
                                {booking.trip_date ? (
                                    `${format(new Date(booking.trip_date.start_date), 'MMM d')} - ${booking.trip_date.end_date ? format(new Date(booking.trip_date.end_date), 'MMM d, yyyy') : 'TBD'}`
                                ) : 'Flexible Dates'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Guests:</span>
                            <span className="font-medium">{booking.guest_count}</span>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <User className="h-4 w-4" /> Customer Info
                    </h3>
                    <div className="bg-muted/30 p-4 rounded-lg border space-y-2">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.customer_name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.customer_email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.customer_phone || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Status Management */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" /> Workflow
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Booking Status</Label>
                            <Select
                                value={booking.status}
                                onValueChange={handleStatusUpdate}
                                disabled={updateBooking.isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Payment Status</Label>
                            <Select
                                value={booking.payment_status}
                                onValueChange={handlePaymentStatusUpdate}
                                disabled={updateBooking.isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="partial">Partial</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Payments */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                            <CreditCard className="h-4 w-4" /> Payment History
                        </h3>
                        <Button size="sm" variant="outline" onClick={() => setIsAddPaymentSearchOpen(true)}>
                            <Plus className="h-3 w-3 mr-1" /> Add Payment
                        </Button>
                    </div>

                    <div className="bg-muted/30 rounded-lg border overflow-hidden">
                        <div className="p-4 border-b bg-background/50 flex justify-between items-center">
                            <div className="text-sm">
                                <span className="text-muted-foreground mr-2">Total Amount:</span>
                                <span className="font-bold">₹{booking.total_amount.toLocaleString()}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-muted-foreground mr-2">Paid:</span>
                                <span className={`font-bold ${booking.amount_paid >= booking.total_amount ? 'text-green-500' : 'text-amber-500'}`}>
                                    ₹{booking.amount_paid.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {isPaymentsLoading ? (
                            <div className="p-4 text-center">
                                <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                            </div>
                        ) : payments?.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground text-sm">
                                No payments recorded yet
                            </div>
                        ) : (
                            <div className="divide-y">
                                {payments?.map((payment) => (
                                    <div key={payment.id} className="p-4 flex items-center justify-between text-sm">
                                        <div>
                                            <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground capitalize">
                                                {format(new Date(payment.payment_date), 'MMM d, yyyy')} • {payment.method.replace('_', ' ')}
                                            </div>
                                        </div>
                                        <Badge variant={payment.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                                            {payment.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes */}
                {(booking.special_requests || booking.internal_notes) && (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Notes</h3>
                        <div className="grid gap-4">
                            {booking.special_requests && (
                                <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20">
                                    <h4 className="text-xs font-bold text-amber-500 uppercase mb-1">Special Requests</h4>
                                    <p className="text-sm">{booking.special_requests}</p>
                                </div>
                            )}
                            {booking.internal_notes && (
                                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                                    <h4 className="text-xs font-bold text-blue-500 uppercase mb-1">Internal Notes</h4>
                                    <p className="text-sm">{booking.internal_notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Payment Dialog */}
            <Dialog open={isAddPaymentSearchOpen} onOpenChange={setIsAddPaymentSearchOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Payment</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Amount (₹)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Payment Method</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="upi">UPI</SelectItem>
                                    <SelectItem value="stripe">Stripe</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddPaymentSearchOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddPayment} disabled={!paymentAmount || addPayment.isPending}>
                            {addPayment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Record Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
