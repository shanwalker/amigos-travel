import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Trash2, GripVertical, Edit, Save, Loader2 } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { useTripItinerary, useUpdateItinerary } from '@/hooks/useTrips';

export interface ItineraryDay {
    id: string;
    day_number: number;
    title: string;
    description: string;
    icon?: string;
    image_url?: string;
    gradient?: string;
}

interface ItineraryBuilderProps {
    tripId?: string;
    initialItinerary?: ItineraryDay[];
    onSave?: (itinerary: ItineraryDay[]) => void;
}

const iconOptions = [
    { value: 'plane', label: '✈️ Plane', icon: '✈️' },
    { value: 'hotel', label: '🏨 Hotel', icon: '🏨' },
    { value: 'food', label: '🍽️ Food', icon: '🍽️' },
    { value: 'camera', label: '📷 Camera', icon: '📷' },
    { value: 'mountain', label: '⛰️ Mountain', icon: '⛰️' },
    { value: 'beach', label: '🏖️ Beach', icon: '🏖️' },
    { value: 'temple', label: '🛕 Temple', icon: '🛕' },
    { value: 'boat', label: '⛵ Boat', icon: '⛵' },
    { value: 'hiking', label: '🥾 Hiking', icon: '🥾' },
    { value: 'sunset', label: '🌅 Sunset', icon: '🌅' },
];

const gradientOptions = [
    { value: 'blue', label: 'Blue', gradient: 'from-blue-500 to-cyan-500' },
    { value: 'green', label: 'Green', gradient: 'from-green-500 to-emerald-500' },
    { value: 'purple', label: 'Purple', gradient: 'from-purple-500 to-pink-500' },
    { value: 'orange', label: 'Orange', gradient: 'from-orange-500 to-red-500' },
    { value: 'yellow', label: 'Yellow', gradient: 'from-yellow-500 to-orange-500' },
];

export const ItineraryBuilder = ({ tripId, initialItinerary = [], onSave }: ItineraryBuilderProps) => {
    // If tripId is provided, fetch data
    const { data: fetchedItinerary, isLoading } = useTripItinerary(tripId || '');
    const updateItineraryMutation = useUpdateItinerary();

    const [itinerary, setItinerary] = useState<ItineraryDay[]>(initialItinerary);
    const [isAddingDay, setIsAddingDay] = useState(false);
    const [editingDay, setEditingDay] = useState<ItineraryDay | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: 'plane',
        gradient: 'blue',
        image_url: '',
    });

    // Update local state when data is fetched
    useEffect(() => {
        if (fetchedItinerary && fetchedItinerary.length > 0) {
            setItinerary(fetchedItinerary as ItineraryDay[]);
        }
    }, [fetchedItinerary]);

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            icon: 'plane',
            gradient: 'blue',
            image_url: '',
        });
    };

    const handleAddDay = () => {
        const newDay: ItineraryDay = {
            id: `day-${Date.now()}`,
            day_number: itinerary.length + 1,
            title: formData.title,
            description: formData.description,
            icon: iconOptions.find(i => i.value === formData.icon)?.icon,
            image_url: formData.image_url || undefined,
            gradient: gradientOptions.find(g => g.value === formData.gradient)?.gradient,
        };

        setItinerary([...itinerary, newDay]);
        setIsAddingDay(false);
        resetForm();
        toast({ title: 'Success', description: 'Day added to itinerary!' });
    };

    const handleEditDay = () => {
        if (!editingDay) return;

        const updatedItinerary = itinerary.map(day =>
            day.id === editingDay.id
                ? {
                    ...day,
                    title: formData.title,
                    description: formData.description,
                    icon: iconOptions.find(i => i.value === formData.icon)?.icon,
                    image_url: formData.image_url || undefined,
                    gradient: gradientOptions.find(g => g.value === formData.gradient)?.gradient,
                }
                : day
        );

        setItinerary(updatedItinerary);
        setEditingDay(null);
        resetForm();
        toast({ title: 'Success', description: 'Day updated successfully!' });
    };

    const handleDeleteDay = (id: string) => {
        const updatedItinerary = itinerary
            .filter(day => day.id !== id)
            .map((day, index) => ({ ...day, day_number: index + 1 }));

        setItinerary(updatedItinerary);
        toast({ title: 'Success', description: 'Day removed from itinerary!' });
    };

    const handleReorder = (newOrder: ItineraryDay[]) => {
        const reorderedItinerary = newOrder.map((day, index) => ({
            ...day,
            day_number: index + 1,
        }));
        setItinerary(reorderedItinerary);
    };

    const handleSave = async () => {
        if (tripId) {
            try {
                await updateItineraryMutation.mutateAsync({ tripId, items: itinerary });
                toast({ title: 'Success', description: 'Itinerary saved to database!' });
            } catch (error) {
                toast({ title: 'Error', description: 'Failed to save itinerary', variant: 'destructive' });
            }
        }

        if (onSave) {
            onSave(itinerary);
        }
    };

    const openEditDialog = (day: ItineraryDay) => {
        setEditingDay(day);
        setFormData({
            title: day.title,
            description: day.description,
            icon: iconOptions.find(i => i.icon === day.icon)?.value || 'plane',
            gradient: gradientOptions.find(g => g.gradient === day.gradient)?.value || 'blue',
            image_url: day.image_url || '',
        });
    };

    if (tripId && isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const DayForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
        <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="title">Day Title *</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Arrival & City Tour"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the day's activities..."
                    rows={4}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {iconOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gradient">Color Theme</Label>
                    <Select value={formData.gradient} onValueChange={(value) => setFormData({ ...formData, gradient: value })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {gradientOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="image_url">Image URL (optional)</Label>
                <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                />
            </div>

            <DialogFooter>
                <Button onClick={onSubmit} disabled={!formData.title || !formData.description}>
                    {submitLabel}
                </Button>
            </DialogFooter>
        </div>
    );

    return (
        <Card className="bg-card/50 border-border/50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground">Trip Itinerary</CardTitle>
                    <div className="flex gap-2">
                        <Button onClick={() => setIsAddingDay(true)} size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Day
                        </Button>
                        {(itinerary.length > 0 || tripId) && (
                            <Button
                                onClick={handleSave}
                                size="sm"
                                variant="default"
                                disabled={updateItineraryMutation.isPending}
                            >
                                {updateItineraryMutation.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Save Itinerary
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {itinerary.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="mb-4">No itinerary days added yet</p>
                        <Button onClick={() => setIsAddingDay(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add First Day
                        </Button>
                    </div>
                ) : (
                    <Reorder.Group axis="y" values={itinerary} onReorder={handleReorder} className="space-y-3">
                        {itinerary.map((day) => (
                            <Reorder.Item key={day.id} value={day}>
                                <motion.div
                                    layout
                                    className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-colors cursor-move"
                                >
                                    <GripVertical className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                                    <div className={`p-3 rounded-lg bg-gradient-to-br ${day.gradient} flex-shrink-0`}>
                                        <span className="text-2xl">{day.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-semibold text-foreground">
                                                    Day {day.day_number}: {day.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {day.description}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 flex-shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditDialog(day)}
                                                    className="h-8 w-8"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteDay(day.id)}
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                )}
            </CardContent>

            {/* Add Day Dialog */}
            <Dialog open={isAddingDay} onOpenChange={setIsAddingDay}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add New Day</DialogTitle>
                    </DialogHeader>
                    <DayForm onSubmit={handleAddDay} submitLabel="Add Day" />
                </DialogContent>
            </Dialog>

            {/* Edit Day Dialog */}
            <Dialog open={!!editingDay} onOpenChange={() => setEditingDay(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Day {editingDay?.day_number}</DialogTitle>
                    </DialogHeader>
                    <DayForm onSubmit={handleEditDay} submitLabel="Update Day" />
                </DialogContent>
            </Dialog>
        </Card>
    );
};
