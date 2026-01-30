import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users, DollarSign, Trash2, Plus, Loader2, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTripDates, useUpdateTripDates } from '@/hooks/useTrips';

export interface TripDate {
    id: string;
    start_date: Date;
    end_date?: Date;
    spots_total: number;
    spots_booked: number;
    price_modifier: number;
    status: 'active' | 'sold_out' | 'cancelled';
}

interface AvailabilityCalendarProps {
    tripId?: string;
    initialDates?: TripDate[];
    basePrice?: number;
    onSave?: (dates: TripDate[]) => void;
}

export const AvailabilityCalendar = ({
    tripId,
    initialDates = [],
    basePrice = 0,
    onSave
}: AvailabilityCalendarProps) => {
    // Data fetching
    const { data: fetchedDates, isLoading } = useTripDates(tripId || '');
    const updateDatesMutation = useUpdateTripDates();

    const [dates, setDates] = useState<TripDate[]>(initialDates);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        spots_total: '20',
        spots_booked: '0',
        price_modifier: '0',
        status: 'active' as const,
    });

    // Sync fetched data
    useEffect(() => {
        if (fetchedDates && fetchedDates.length > 0) {
            // fetchedDates are already parsed to JS Date objects by the hook wrapper
            setDates(fetchedDates.map(d => ({
                id: d.id,
                start_date: new Date(d.start_date),
                end_date: d.end_date ? new Date(d.end_date) : undefined,
                spots_total: d.spots_total,
                spots_booked: d.spots_booked,
                price_modifier: d.price_modifier,
                status: d.status
            })));
        }
    }, [fetchedDates]);

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            // Check if date already exists
            const existingDate = dates.find(d =>
                d.start_date.toDateString() === date.toDateString()
            );

            if (existingDate) {
                setEditingId(existingDate.id);
                setFormData({
                    spots_total: existingDate.spots_total.toString(),
                    spots_booked: existingDate.spots_booked.toString(),
                    price_modifier: existingDate.price_modifier.toString(),
                    status: existingDate.status,
                });
            } else {
                setEditingId(null);
                setFormData({
                    spots_total: '20',
                    spots_booked: '0',
                    price_modifier: '0',
                    status: 'active',
                });
            }
            setIsDialogOpen(true);
        }
    };

    const handleSaveDate = () => {
        if (!selectedDate) return;

        const newDateData: TripDate = {
            id: editingId || `date-${Date.now()}`,
            start_date: selectedDate,
            spots_total: parseInt(formData.spots_total) || 20,
            spots_booked: parseInt(formData.spots_booked) || 0,
            price_modifier: parseFloat(formData.price_modifier) || 0,
            status: formData.status,
        };

        if (editingId) {
            setDates(dates.map(d => d.id === editingId ? newDateData : d));
            toast({ title: 'Success', description: 'Date updated successfully!' });
        } else {
            setDates([...dates, newDateData]);
            toast({ title: 'Success', description: 'New departure date added!' });
        }

        setIsDialogOpen(false);
        // We trigger local save, but real DB save is via button
    };

    const handleDeleteDate = (id: string) => {
        const newDates = dates.filter(d => d.id !== id);
        setDates(newDates);
        toast({ title: 'Success', description: 'Date removed!' });
    };

    const handleSaveToDb = async () => {
        if (tripId) {
            try {
                await updateDatesMutation.mutateAsync({ tripId, dates });
                toast({ title: 'Success', description: 'Availability saved to database!' });
            } catch (error) {
                toast({ title: 'Error', description: 'Failed to save availability', variant: 'destructive' });
            }
        }

        if (onSave) {
            onSave(dates);
        }
    };

    // Modifiers for calendar display
    const bookedDates = dates.map(d => d.start_date);
    const soldOutDates = dates.filter(d => d.status === 'sold_out' || d.spots_booked >= d.spots_total).map(d => d.start_date);

    if (tripId && isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Card className="bg-card/50 border-border/50 h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Availability & Dates
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10">
                            {dates.length} scheduled departures
                        </Badge>
                        {(dates.length > 0 || tripId) && (
                            <Button
                                onClick={handleSaveToDb}
                                size="sm"
                                variant="default"
                                disabled={updateDatesMutation.isPending}
                            >
                                {updateDatesMutation.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Save Dates
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex justify-center border rounded-lg p-4 bg-background/50">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            className="rounded-md"
                            modifiers={{
                                available: bookedDates,
                                soldOut: soldOutDates,
                            }}
                            modifiersStyles={{
                                available: {
                                    fontWeight: 'bold',
                                    color: 'var(--primary)',
                                    border: '1px solid var(--primary)'
                                },
                                soldOut: {
                                    textDecoration: 'line-through',
                                    color: 'var(--muted-foreground)',
                                    opacity: 0.5
                                }
                            }}
                        />
                    </div>

                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm text-muted-foreground">Scheduled Departures</h3>
                            <Button size="sm" variant="ghost" onClick={() => { setSelectedDate(new Date()); setIsDialogOpen(true); }}>
                                <Plus className="h-4 w-4 mr-1" /> Add Date
                            </Button>
                        </div>

                        {dates.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                                <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No dates scheduled yet</p>
                                <p className="text-xs">Select a date on the calendar to add one</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {dates
                                    .sort((a, b) => a.start_date.getTime() - b.start_date.getTime())
                                    .map((date) => (
                                        <div key={date.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="text-center bg-primary/10 rounded p-2 min-w-[50px]">
                                                    <div className="text-xs font-bold text-primary uppercase">{format(date.start_date, 'MMM')}</div>
                                                    <div className="text-lg font-bold text-foreground">{format(date.start_date, 'd')}</div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{format(date.start_date, 'EEE, MMMM d, yyyy')}</span>
                                                        {date.status === 'sold_out' && <Badge variant="destructive" className="text-[10px] h-5">Sold Out</Badge>}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Users className="h-3 w-3" />
                                                            {date.spots_booked}/{date.spots_total} spots
                                                        </span>
                                                        {date.price_modifier !== 0 && (
                                                            <span className={`flex items-center gap-1 ${date.price_modifier > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                                                <DollarSign className="h-3 w-3" />
                                                                {date.price_modifier > 0 ? '+' : ''}{date.price_modifier}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedDate(date.start_date); handleDateSelect(date.start_date); }}>
                                                    <CalendarIcon className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteDate(date.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Departure Date' : 'Add Departure Date'}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Selected Date</Label>
                            <div className="p-2 border rounded-md bg-muted/50 font-medium">
                                {selectedDate ? format(selectedDate, 'PPP') : 'No date selected'}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="spots_total">Total Spots</Label>
                                <Input
                                    id="spots_total"
                                    type="number"
                                    value={formData.spots_total}
                                    onChange={(e) => setFormData({ ...formData, spots_total: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="spots_booked">Booked Spots</Label>
                                <Input
                                    id="spots_booked"
                                    type="number"
                                    value={formData.spots_booked}
                                    onChange={(e) => setFormData({ ...formData, spots_booked: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price_modifier">Price Adjustment (₹)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="price_modifier"
                                    type="number"
                                    className="pl-9"
                                    value={formData.price_modifier}
                                    onChange={(e) => setFormData({ ...formData, price_modifier: e.target.value })}
                                    placeholder="0 for base price, +ve to increase, -ve to decrease"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Final Price: ₹{(basePrice + (parseFloat(formData.price_modifier) || 0)).toLocaleString()}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="sold_out">Sold Out</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveDate}>Save Date</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};
